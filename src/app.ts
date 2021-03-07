import express from 'express';
import path from 'path';
import { Server } from 'http';
import { ChatServer } from './ChatServer';

const app = express();
const httpServer = new Server(app);

const PORT = Number(process.env.port) || 8080;

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// init chat server and listen
new ChatServer(httpServer).listen(PORT);