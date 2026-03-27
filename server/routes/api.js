const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// POST /create-room
router.post('/create-room', async (req, res) => {
  const { username, team, privacy = 'public', mode = 'mega' } = req.body;
  if (!username || !team) return res.status(400).json({ error: 'Username and team required' });
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const roomId = generateRoomCode();
    const userId = `${username.replace(/[^a-zA-Z0-9]/g, '')}_${Math.random().toString(36).substring(2,6)}`;
    
    await client.query(
      `INSERT INTO rooms (id, host_id, status, privacy, mode) VALUES ($1, $2, 'waiting', $3, $4)`,
      [roomId, userId, privacy, mode]
    );

    await client.query(
      `INSERT INTO auction_settings (room_id) VALUES ($1)`,
      [roomId]
    );

    await client.query(
      `INSERT INTO room_participants (room_id, user_id, username, team, is_host) VALUES ($1, $2, $3, $4, $5)`,
      [roomId, userId, username, team, true]
    );

    await client.query('COMMIT');
    res.json({ roomId, userId, username, team, isHost: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Room creation error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  } finally {
    client.release();
  }
});

// POST /join-room
router.post('/join-room', async (req, res) => {
  const { roomId: rawRoomId, username, team } = req.body;
  if (!rawRoomId || !username || !team) return res.status(400).json({ error: 'Missing required fields' });
  
  const roomId = rawRoomId.toUpperCase();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const roomRes = await client.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
    if (roomRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const teamRes = await client.query('SELECT * FROM room_participants WHERE room_id = $1 AND team = $2', [roomId, team]);
    if (teamRes.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Team already taken in this room' });
    }
    
    const partsRes = await client.query('SELECT * FROM room_participants WHERE room_id = $1', [roomId]);
    if (partsRes.rowCount >= 10) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Room is full (max 10)' });
    }

    const userId = `${username.replace(/[^a-zA-Z0-9]/g, '')}_${Math.random().toString(36).substring(2,6)}`;
    await client.query(
      `INSERT INTO room_participants (room_id, user_id, username, team, is_host) VALUES ($1, $2, $3, $4, $5)`,
      [roomId, userId, username, team, false]
    );

    await client.query('COMMIT');
    res.json({ roomId, userId, username, team, isHost: false });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Failed to join room' });
  } finally {
    client.release();
  }
});

// GET /rooms
router.get('/rooms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.status, r.mode, COUNT(p.user_id) as participants_count 
      FROM rooms r 
      LEFT JOIN room_participants p ON r.id = p.room_id 
      WHERE r.privacy = 'public'
      GROUP BY r.id, r.status, r.mode
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch rooms error:', err);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET /room/:id/settings
router.get('/room/:id/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM auction_settings WHERE room_id = $1', [req.params.id.toUpperCase()]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Settings not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
