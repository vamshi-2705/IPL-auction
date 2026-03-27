import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export function useAuctionSocket(roomId, userId, initialStatus) {
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [settings, setSettings] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState(initialStatus || 'waiting'); 
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timer, setTimer] = useState(0);
  const [soldLog, setSoldLog] = useState([]);
  const [squads, setSquads] = useState([]);
  const [queue, setQueue] = useState([]);

  const playerRef = useRef(currentPlayer);
  useEffect(() => { playerRef.current = currentPlayer }, [currentPlayer]);

  useEffect(() => {
    if (!roomId || !userId) return;
    
    const s = io('/');
    
    s.on('connect', () => {
       s.emit('joinRoom', { roomId, userId });
    });

    s.on('participants_updated', setParticipants);
    s.on('settings_updated', setSettings);
    s.on('auction_started', () => setAuctionStatus('running'));
    s.on('auction_paused', () => setAuctionStatus('paused'));
    s.on('auction_resumed', () => setAuctionStatus('running'));
    s.on('auction_finished', () => setAuctionStatus('finished'));
    
    s.on('next_player', setCurrentPlayer);
    s.on('timer_update', setTimer);
    
    s.on('bid_update', ({ amount, highestBidder }) => {
       setCurrentPlayer(prev => prev ? { ...prev, current_bid: amount, highest_bidder: highestBidder } : prev);
    });

    s.on('player_sold', (info) => {
       setSoldLog(prev => [{ ...info, playerDetails: playerRef.current }, ...prev]);
       setCurrentPlayer(null);
    });

    s.on('player_unsold', (info) => {
       setSoldLog(prev => [{ ...info, unsold: true, playerDetails: playerRef.current }, ...prev]);
       setCurrentPlayer(null);
    });

    s.on('user_kicked', ({ userId: kickedUserId }) => {
       if (kickedUserId === userId) {
          alert('You have been kicked from the room by the host.');
          localStorage.removeItem('auction_user');
          window.location.href = '/';
       }
    });

    s.on('room_closed', () => {
       alert('The host has closed this auction room.');
       localStorage.removeItem('auction_user');
       window.location.href = '/';
    });

    s.on('squads_updated', setSquads);
    s.on('queue_updated', setQueue);

    setSocket(s);
    return () => s.disconnect();
  }, [roomId, userId]);

  const updateSettings = (newSettings) => socket?.emit('updateSettings', { roomId, userId, settings: newSettings });
  const startAuction = () => socket?.emit('startAuction', { roomId, userId });
  const placeBid = (amount) => socket?.emit('placeBid', { roomId, userId, amount });
  const pauseAuction = () => socket?.emit('pauseAuction', { roomId, userId });
  const resumeAuction = () => socket?.emit('resumeAuction', { roomId, userId });
  const endAuction = () => socket?.emit('endAuction', { roomId, userId });
  const kickUser = (targetUserId) => socket?.emit('kickUser', { roomId, hostId: userId, targetUserId });
  const closeRoom = () => socket?.emit('closeRoom', { roomId, hostId: userId });
  const voteSkip = () => socket?.emit('voteSkip', { roomId, userId });
  const withdrawBid = () => socket?.emit('withdrawBid', { roomId, userId });

  return { 
    socket, participants, settings, auctionStatus, currentPlayer, timer, 
    soldLog, squads, queue, skipVote,
    updateSettings, startAuction, placeBid, pauseAuction, resumeAuction, 
    endAuction, kickUser, closeRoom, voteSkip, withdrawBid 
  };
}
