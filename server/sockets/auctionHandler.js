const { pool } = require('../db/pool');

function setupAuctionSockets(io) {
  const roomTimers = {};
  
  io.on('connection', (socket) => {
    
    socket.on('joinRoom', async ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        
        const res = await pool.query('SELECT * FROM room_participants WHERE room_id = $1', [roomId]);
        io.to(roomId).emit('participants_updated', res.rows);

        const settingsRes = await pool.query('SELECT * FROM auction_settings WHERE room_id = $1', [roomId]);
        if (settingsRes.rowCount > 0) {
           const settings = settingsRes.rows[0];
           socket.emit('settings_updated', settings);
           // Initialize room timer object if missing
           if (!roomTimers[roomId]) {
              roomTimers[roomId] = { timeLeft: settings.bid_timer, duration: settings.bid_timer, interval: null };
           } else {
              roomTimers[roomId].duration = settings.bid_timer;
           }
        }

        const roomRes = await pool.query('SELECT status FROM rooms WHERE id = $1', [roomId]);
        if (roomRes.rowCount > 0) {
           if (roomRes.rows[0].status === 'running') socket.emit('auction_started');
           if (roomRes.rows[0].status === 'paused') socket.emit('auction_paused');
           if (roomRes.rows[0].status === 'finished') socket.emit('auction_finished');
        }

        const activeRes = await pool.query(`
          SELECT s.*, p.name, p.role, p.country, p.base_price, p.set_category, p.image_url 
          FROM auction_state s JOIN players p ON s.player_id = p.id 
          WHERE s.room_id = $1 AND s.status = 'active'
        `, [roomId]);
        if (activeRes.rowCount > 0) {
           socket.emit('next_player', activeRes.rows[0]);
        }
        
        // Sync active timer for late joiners
        if (roomTimers[roomId]) {
           socket.emit('timer_update', roomTimers[roomId].timeLeft);
        }
        
        await broadcastSquads(roomId, io);
        await broadcastQueue(roomId, io);
      } catch (err) {
        console.error('Error in joinRoom:', err);
      }
    });

    socket.on('updateSettings', async ({ roomId, userId, settings }) => {
      try {
        await pool.query(
          `UPDATE auction_settings SET purse_money = $1, bid_timer = $2, min_squad = $3, max_squad = $4, max_overseas = $5 WHERE room_id = $6`,
          [settings.purse_money, settings.bid_timer, settings.min_squad, settings.max_squad, settings.max_overseas, roomId]
        );
        
        // Update memory cache
        if (roomTimers[roomId]) {
           roomTimers[roomId].duration = settings.bid_timer;
        }
        
        io.to(roomId).emit('settings_updated', settings);
      } catch (err) {
        console.error('Error in updateSettings:', err);
      }
    });

    socket.on('startAuction', async ({ roomId, userId }) => {
      try {
        const hostRes = await pool.query('SELECT is_host FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
        if (!hostRes.rows[0]?.is_host) return;

        const roomRes = await pool.query('SELECT mode FROM rooms WHERE id = $1', [roomId]);
        const roomMode = roomRes.rows[0]?.mode || 'mega';

        // Ensure timer duration is cached
        const settingsRes = await pool.query('SELECT bid_timer FROM auction_settings WHERE room_id = $1', [roomId]);
        const duration = settingsRes.rows[0]?.bid_timer || 15;
        if (!roomTimers[roomId]) {
           roomTimers[roomId] = { timeLeft: duration, duration: duration, interval: null };
        } else {
           roomTimers[roomId].duration = duration;
        }

        const qRes = await pool.query('SELECT count(*) FROM auction_state WHERE room_id = $1', [roomId]);
        if (parseInt(qRes.rows[0].count) === 0) {
           // Fetch all players for a truly random shuffle (ignore categories if requested)
           const playersRes = await pool.query("SELECT id, base_price FROM players ORDER BY RANDOM()");
           const players = playersRes.rows;
           
           if (players.length > 0) {
              let insertQuery = 'INSERT INTO auction_state (room_id, player_id, current_bid, status, order_index) VALUES ';
              const values = [];
              players.forEach((p, i) => {
                 insertQuery += `($${i*4 + 1}, $${i*4 + 2}, $${i*4 + 3}, 'pending', $${i*4 + 4}),`;
                 values.push(roomId, p.id, p.base_price, i); 
              });
              insertQuery = insertQuery.slice(0, -1);
              await pool.query(insertQuery, values);
           }
        }

        await pool.query("UPDATE rooms SET status = 'running' WHERE id = $1", [roomId]);
        io.to(roomId).emit('auction_started');
        loadNextPlayer(roomId, io, roomTimers);
      } catch (err) {
         console.error('Error starting auction:', err);
      }
    });

    socket.on('placeBid', async ({ roomId, userId, amount }) => {
       try {
          const stateRes = await pool.query('SELECT * FROM auction_state WHERE room_id = $1 AND status = $2', [roomId, 'active']);
          if (stateRes.rowCount === 0) return;
          
          const currentState = stateRes.rows[0];
          if (parseInt(amount) <= parseInt(currentState.current_bid) && currentState.highest_bidder) return;
          
          const pRes = await pool.query('SELECT purse_balance FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
          if (pRes.rowCount === 0 || parseInt(pRes.rows[0].purse_balance) < parseInt(amount)) return;

          // Store previous bid for Withdraw functionality
          await pool.query(
             'UPDATE auction_state SET current_bid = $1, highest_bidder = $2, prev_bid = $3, prev_bidder = $4 WHERE room_id = $5 AND player_id = $6',
             [parseInt(amount), userId, currentState.current_bid, currentState.highest_bidder, roomId, currentState.player_id]
          );

          await pool.query('INSERT INTO bids (room_id, player_id, user_id, amount) VALUES ($1, $2, $3, $4)', [roomId, currentState.player_id, userId, parseInt(amount)]);

          // Reset skip votes on new bid
          if (roomTimers[roomId]) roomTimers[roomId].skipVotes = new Set();
          io.to(roomId).emit('skip_vote_count', 0);

          io.to(roomId).emit('bid_update', { playerId: currentState.player_id, amount: parseInt(amount), highestBidder: userId });

          // Timer logic
          startTimer(roomId, io, roomTimers, true, false);
        } catch (err) {
           console.error('Bid error:', err);
        }
     });

     socket.on('pauseAuction', async ({ roomId, userId }) => {
        try {
           const hostRes = await pool.query('SELECT is_host FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
           if (!hostRes.rows[0]?.is_host) return;
           
           if (roomTimers[roomId]) clearInterval(roomTimers[roomId].interval);
           await pool.query("UPDATE rooms SET status = 'paused' WHERE id = $1", [roomId]);
           io.to(roomId).emit('auction_paused');
        } catch (err) { console.error('Pause err:', err); }
     });

     socket.on('resumeAuction', async ({ roomId, userId }) => {
        try {
           const hostRes = await pool.query('SELECT is_host FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
           if (!hostRes.rows[0]?.is_host) return;
           
           await pool.query("UPDATE rooms SET status = 'running' WHERE id = $1", [roomId]);
           io.to(roomId).emit('auction_resumed');
           startTimer(roomId, io, roomTimers, false, true); 
        } catch (err) { console.error('Resume err:', err); }
     });

     socket.on('endAuction', async ({ roomId, userId }) => {
        try {
           const hostRes = await pool.query('SELECT is_host FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
           if (!hostRes.rows[0]?.is_host) return;
           
           if (roomTimers[roomId]?.interval) {
              clearInterval(roomTimers[roomId].interval);
              roomTimers[roomId].interval = null;
           }
           await pool.query("UPDATE rooms SET status = 'finished' WHERE id = $1", [roomId]);
           io.to(roomId).emit('auction_finished');
        } catch (err) { console.error('End err:', err); }
     });

     socket.on('kickUser', async ({ roomId, hostId, targetUserId }) => {
        try {
           const hostRes = await pool.query('SELECT is_host FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, hostId]);
           if (!hostRes.rows[0]?.is_host) return;

           await pool.query('DELETE FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, targetUserId]);
           
           // Notify everyone that participants changed
           const res = await pool.query('SELECT * FROM room_participants WHERE room_id = $1', [roomId]);
           io.to(roomId).emit('participants_updated', res.rows);
           
           // Specifically notify the kicked user
           io.to(roomId).emit('user_kicked', { userId: targetUserId });
        } catch (err) {
           console.error('Kick error:', err);
        }
     });

     socket.on('closeRoom', async ({ roomId, hostId }) => {
        try {
           const hostRes = await pool.query('SELECT is_host FROM room_participants WHERE room_id = $1 AND user_id = $2', [roomId, hostId]);
           if (!hostRes.rows[0]?.is_host) return;

           if (roomTimers[roomId]?.interval) {
              clearInterval(roomTimers[roomId].interval);
              roomTimers[roomId].interval = null;
           }

           await pool.query("UPDATE rooms SET status = 'finished' WHERE id = $1", [roomId]);
           io.to(roomId).emit('room_closed');
        } catch (err) {
           console.error('Close room error:', err);
        }
     });

     socket.on('voteSkip', async ({ roomId, userId }) => {
        try {
           if (!roomTimers[roomId]) return;
           if (!roomTimers[roomId].skipVotes) roomTimers[roomId].skipVotes = new Set();
           
           roomTimers[roomId].skipVotes.add(userId);
           
           const participantsRes = await pool.query('SELECT user_id FROM room_participants WHERE room_id = $1', [roomId]);
           const totalParticipants = participantsRes.rowCount;
           const currentVotes = roomTimers[roomId].skipVotes.size;
           
           io.to(roomId).emit('skip_vote_count', { current: currentVotes, total: totalParticipants });
           
           if (currentVotes >= totalParticipants && totalParticipants > 0) {
              // Trigger skip
              if (roomTimers[roomId].interval) clearInterval(roomTimers[roomId].interval);
              roomTimers[roomId].skipVotes = new Set();
              io.to(roomId).emit('skip_vote_count', { current: 0, total: totalParticipants });
              await handlePlayerSold(roomId, io, roomTimers);
           }
        } catch (err) {
           console.error('Skip Vote Error:', err);
        }
     });

     socket.on('withdrawBid', async ({ roomId, userId }) => {
        try {
           const stateRes = await pool.query('SELECT * FROM auction_state WHERE room_id = $1 AND status = $2', [roomId, 'active']);
           if (stateRes.rowCount === 0) return;
           
           const currentState = stateRes.rows[0];
           if (currentState.highest_bidder !== userId) return; // Only bidder can withdraw

           // Revert to previous bid/bidder
           const prevBid = currentState.prev_bid || currentState.base_price;
           const prevBidder = currentState.prev_bidder || null;

           await pool.query(
              'UPDATE auction_state SET current_bid = $1, highest_bidder = $2, prev_bid = NULL, prev_bidder = NULL WHERE room_id = $3 AND player_id = $4',
              [prevBid, prevBidder, roomId, currentState.player_id]
           );

           io.to(roomId).emit('bid_update', { playerId: currentState.player_id, amount: prevBid, highestBidder: prevBidder });
           
           // Optionally restart timer
           startTimer(roomId, io, roomTimers, true, false);
        } catch (err) {
           console.error('Withdraw err:', err);
        }
     });

  });
}

async function loadNextPlayer(roomId, io, roomTimers) {
   try {
     const nextRes = await pool.query('SELECT * FROM auction_state WHERE room_id = $1 AND status = $2 ORDER BY order_index ASC LIMIT 1', [roomId, 'pending']);
     if (nextRes.rowCount === 0) {
         await pool.query("UPDATE rooms SET status = 'finished' WHERE id = $1", [roomId]);
         io.to(roomId).emit('auction_finished');
         return;
     }
     
     const nextPlayer = nextRes.rows[0];
     await pool.query('UPDATE auction_state SET status = $1 WHERE room_id = $2 AND player_id = $3', ['active', roomId, nextPlayer.player_id]);
     
     const activeRes = await pool.query(`
        SELECT s.*, p.name, p.role, p.country, p.base_price, p.set_category, p.image_url 
        FROM auction_state s JOIN players p ON s.player_id = p.id 
        WHERE s.room_id = $1 AND s.player_id = $2
     `, [roomId, nextPlayer.player_id]);

     io.to(roomId).emit('next_player', activeRes.rows[0]);
     await broadcastQueue(roomId, io);
     startTimer(roomId, io, roomTimers, false, false);
   } catch (err) {
      console.error(err);
   }
}

async function startTimer(roomId, io, roomTimers, isReset, isResume = false) {
   try {
      // 1. Immediately clear existing interval to prevent double-timers
      if (roomTimers[roomId]?.interval) {
         clearInterval(roomTimers[roomId].interval);
         roomTimers[roomId].interval = null;
      }
      
      // 2. Ensure room memory object exists
      if (!roomTimers[roomId]) {
         roomTimers[roomId] = { timeLeft: 15, duration: 15, interval: null };
      }
      
      // 3. Determine new timeLeft (Use memory duration to avoid slow DB calls)
      let timeLeft = roomTimers[roomId].duration || 15;
      
      if (isResume && roomTimers[roomId].timeLeft !== undefined) {
         timeLeft = roomTimers[roomId].timeLeft;
      } else if (isReset) {
         // Reset back to full duration on every valid bid
         timeLeft = roomTimers[roomId].duration;
      }
      
      roomTimers[roomId].timeLeft = timeLeft;
      io.to(roomId).emit('timer_update', timeLeft);
      
      // 4. Start fresh interval
      roomTimers[roomId].interval = setInterval(async () => {
         try {
            if (!roomTimers[roomId]) return;
            
            roomTimers[roomId].timeLeft--;
            io.to(roomId).emit('timer_update', roomTimers[roomId].timeLeft);
            
            if (roomTimers[roomId].timeLeft <= 0) {
               clearInterval(roomTimers[roomId].interval);
               roomTimers[roomId].interval = null;
               await handlePlayerSold(roomId, io, roomTimers);
            }
         } catch (tickErr) {
            console.error('Timer tick error:', tickErr);
         }
      }, 1000);
   } catch (err) {
      console.error('startTimer Error:', err);
   }
}

async function handlePlayerSold(roomId, io, roomTimers) {
   try {
      const stateRes = await pool.query('SELECT * FROM auction_state WHERE room_id = $1 AND status = $2', [roomId, 'active']);
      if (stateRes.rowCount === 0) return;
      
      const { player_id, current_bid, highest_bidder } = stateRes.rows[0];
      
      if (highest_bidder) {
         await pool.query('BEGIN');
         await pool.query("UPDATE auction_state SET status = 'sold' WHERE room_id = $1 AND player_id = $2", [roomId, player_id]);
         await pool.query('INSERT INTO team_squads (room_id, user_id, player_id, bought_price) VALUES ($1, $2, $3, $4)', [roomId, highest_bidder, player_id, current_bid]);
         await pool.query('UPDATE room_participants SET purse_balance = purse_balance - $1 WHERE room_id = $2 AND user_id = $3', [current_bid, roomId, highest_bidder]);
         await pool.query('COMMIT');
         
         io.to(roomId).emit('player_sold', { playerId: player_id, soldTo: highest_bidder, price: current_bid });
      } else {
         await pool.query("UPDATE auction_state SET status = 'unsold' WHERE room_id = $1 AND player_id = $2", [roomId, player_id]);
         io.to(roomId).emit('player_unsold', { playerId: player_id });
      }
      
      const res = await pool.query('SELECT * FROM room_participants WHERE room_id = $1', [roomId]);
      io.to(roomId).emit('participants_updated', res.rows);

      await broadcastSquads(roomId, io);

      setTimeout(() => loadNextPlayer(roomId, io, roomTimers), 3000);
   } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
   }
}

async function broadcastSquads(roomId, io) {
  try {
    const res = await pool.query(`
      SELECT ts.user_id, p.name, p.role, p.country, ts.bought_price 
      FROM team_squads ts 
      JOIN players p ON ts.player_id = p.id 
      WHERE ts.room_id = $1
    `, [roomId]);
    io.to(roomId).emit('squads_updated', res.rows);
  } catch (err) {
    console.error(err);
  }
}

async function broadcastQueue(roomId, io) {
  try {
    const res = await pool.query(`
      SELECT p.name, p.role, p.set_category, p.base_price, p.image_url 
      FROM auction_state s JOIN players p ON s.player_id = p.id 
      WHERE s.room_id = $1 AND s.status = 'pending'
      ORDER BY s.order_index ASC
      LIMIT 5
    `, [roomId]);
    io.to(roomId).emit('queue_updated', res.rows);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { setupAuctionSockets };
