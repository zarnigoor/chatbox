const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (for development only)
    methods: ["GET", "POST"]
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle joining event
  socket.on('join', (username) => {
    io.emit('message', {
      type: 'join',
      text: `${username} joined the chat`,
      time: new Date().toLocaleTimeString()
    });
  });

  // Handle message event
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
