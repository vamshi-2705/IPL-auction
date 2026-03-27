const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./db/pool');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const { setupAuctionSockets } = require('./sockets/auctionHandler');
setupAuctionSockets(io);

// Temporary Admin Routes for Remote Setup (Visit these once in browser)
const { initializeDatabase, seedRemote } = require('./db/remoteSetup');
app.get('/api/admin/setup', async (req, res) => {
  try {
    const msg = await initializeDatabase();
    res.send(msg);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/admin/seed', async (req, res) => {
  try {
    const msg = await seedRemote();
    res.send(msg);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Static Assets
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
