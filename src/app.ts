import express from 'express';
import path from 'path';
import { Server } from 'http';
import { ChatServer } from './ChatServer';

const app = express();
const httpServer = new Server(app);

const PORT = process.env.port || 8080;

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// init socketIo
new ChatServer(httpServer).init();

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});