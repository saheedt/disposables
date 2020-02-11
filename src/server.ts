import { createServer } from 'http';
import path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import socketIo from 'socket.io';
import dotenv from 'dotenv';

import { SocketController } from './server/socket/SocketController';
import { MongoController, RedisController } from './server/database';
import { ChatListener, UserListener } from './server/socket/listeners';
import { ChatHandler, UserHandler } from './server/socket/handlers';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 900;

app.use(express.static(path.resolve(__dirname, '../dist/client')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../dist/client/index.html'));
});

// spin up a single DB and store instance respectively
const mongoClient = new MongoController();
const redisClient = new RedisController();
const redisAdapter = RedisController.initRedisAdapder(process.env.REDIS_URI);

console.log('incoming...');

// setup socket, it's listeners and handlers
const socket = new SocketController(server, socketIo);
const chatHandler = new ChatHandler()
const userHandler = new UserHandler();
console.log('now..')
const start = Date.now();
setTimeout(() => {
    userHandler.connectDb(mongoClient.instance);
    socket.connect({
        ChatListener: new ChatListener(chatHandler),
        UserListener: new UserListener(userHandler)
    });
    socket.attachAdapter(redisAdapter);
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    const end = Date.now() - start;
    console.log(`Took: ${Math.floor(end / 1000)} second(s)`);
}, 1000);
