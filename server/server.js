// server/server.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';
import http from 'http';

// --- CONFIGURATION (Unchanged) ---
const app = express();
const server = http.createServer(app);
const port = 3001;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// --- MIDDLEWARE (Unchanged) ---
app.use(cors());
app.use(express.json());

// --- AI PROBLEM GENERATOR (Unchanged) ---
app.post('/api/generate-problem', async (req, res) => {
  // This route is not changed.
  // ... your existing AI generator code ...
});


// === REAL-TIME LOGIC ===
let waitingPlayer = null;
// This object will store which room each player is in.
const playerRooms = {};

io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  socket.on('find_match', () => {
    console.log(`Socket ${socket.id} is looking for a match.`);
    
    if (waitingPlayer) {
      // --- A MATCH IS FOUND ---
      const player1Socket = waitingPlayer;
      const player2Socket = socket;
      
      waitingPlayer = null;

      // Create a unique room ID for this match
      const roomId = `room-${Date.now()}`;
      
      // Both players join the Socket.IO room
      player1Socket.join(roomId);
      player2Socket.join(roomId);

      // We remember which room each player belongs to
      playerRooms[player1Socket.id] = roomId;
      playerRooms[player2Socket.id] = roomId;

      console.log(`Match found! Room: ${roomId}. Players: ${player1Socket.id}, ${player2Socket.id}`);

      const gameData = {
        levelId: "1",
        room: roomId, // Send the room ID to both players
      };
      
      // We can now safely emit to the room
      io.to(roomId).emit('game_start', gameData);

    } else {
      // --- NO OPPONENT IS WAITING ---
      waitingPlayer = socket;
      console.log(`Socket ${socket.id} is now waiting for an opponent.`);
    }
  });

  // === NEW: LISTEN FOR A COMPLETED PROOF ===
  socket.on('proof_completed', (data) => {
    const { room } = data;
    if (room) {
      console.log(`Proof completed by ${socket.id} in room ${room}!`);
      // The first player to send this message is the winner.
      // We immediately emit a 'game_over' event to everyone in that room.
      io.to(room).emit('game_over', { winnerId: socket.id });
    }
  });


  socket.on('cancel_matchmaking', () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
      console.log(`Socket ${socket.id} canceled matchmaking.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    const roomId = playerRooms[socket.id];
    if (roomId) {
      // If the disconnected player was in a room, tell the other player.
      // You could add logic here to give the remaining player a win.
      console.log(`Player ${socket.id} from room ${roomId} disconnected.`);
      delete playerRooms[socket.id];
    }

    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
      console.log('The waiting player disconnected. Queue is now empty.');
    }
  });
});


// --- START THE SERVER (Unchanged) ---
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});