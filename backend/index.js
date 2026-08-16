import Room from "./room.js";
import express from 'express';
import http from 'http';
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app); // HTTP server wrapped around Express
const wss = new WebSocketServer({ server }); // Attach WebSocket server to HTTP server

const rooms = new Map();

function handleMessage(message, ws) {
    const parts = message.toString().split(':');
    if (parts[0] == "join") {
        if (!rooms.has(parts[1])) {
            rooms.set(parts[1], new Room(parts[1]));
            console.log("Created room");
        }
        rooms.get(parts[1]).join(ws);
        console.log("Joined room");
    }
}

wss.on('connection', (ws) => {
  console.log('Client connected!');

  // Listen for messages from the client
  ws.on('message', (data) => {
    handleMessage(data, ws)
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});