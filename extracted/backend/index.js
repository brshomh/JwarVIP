
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any frontend (update this in production for security)
    methods: ["GET", "POST"]
  }
});

// Queue to hold users waiting for a match
// Structure: { male: [], female: [], any: [] }
let waitingQueue = {
    male: [],
    female: [],
    any: []
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User wants to find a match
  socket.on('find_match', ({ gender }) => {
    const userGender = 'any'; // Simplification: In a real app, send user's own gender too
    const preference = gender || 'any';

    console.log(`User ${socket.id} looking for ${preference}`);

    // Check if there is someone in the queue matching the preference
    // For this simple version, we just match 'any' with 'any' or specific
    
    let match = null;

    // Simple Matching Logic (FIFO)
    // 1. Look for anyone waiting
    if (waitingQueue.any.length > 0) {
        match = waitingQueue.any.shift();
    }

    if (match) {
        // A match is found!
        const roomId = `${socket.id}-${match.id}`;
        
        socket.join(roomId);
        const matchSocket = io.sockets.sockets.get(match.id);
        
        if (matchSocket) {
            matchSocket.join(roomId);
            
            // Notify both users
            io.to(roomId).emit('match_found', { 
                roomId,
                timestamp: Date.now()
            });

            // Tell the current user to initiate the call (create offer)
            socket.emit('match_found', { peerId: match.id, role: 'initiator' });
            matchSocket.emit('match_found', { peerId: socket.id, role: 'receiver' });
            
            console.log(`Matched ${socket.id} with ${match.id}`);
        } else {
            // Match disconnected before connecting, push current user back to queue
            waitingQueue.any.push({ id: socket.id, preference });
        }
    } else {
        // No match found, add to queue
        waitingQueue.any.push({ id: socket.id, preference });
        console.log(`User ${socket.id} added to waiting queue`);
    }
  });

  // Relay WebRTC Signals (Offer, Answer, ICE Candidates)
  socket.on('signal', (data) => {
      const { target, type, data: signalData } = data;
      io.to(target).emit('signal', {
          target: socket.id, // From sender
          type,
          data: signalData
      });
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove from queue if waiting
      waitingQueue.any = waitingQueue.any.filter(u => u.id !== socket.id);
      
      // Notify any connected peer to close video
      // In a real app, you'd track active rooms to know who to notify specifically
      socket.broadcast.emit('peer_disconnected', { peerId: socket.id });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
