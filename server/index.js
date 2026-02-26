import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('PulseGuard WebSocket Server - alive');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      // Broadcast to all connected clients
      const out = JSON.stringify(data);
      wss.clients.forEach((client) => {
        if (client.readyState === 1) client.send(out);
      });
    } catch (err) {
      // ignore invalid messages
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`PulseGuard WS server listening on http://localhost:${PORT}`);
});
