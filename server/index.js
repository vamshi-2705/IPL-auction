const express = require('express');
const http = require('http');
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
    origin: "*", // Allow all in dev
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

// Serve Static Assets in Production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
