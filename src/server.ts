import { createServer } from 'http';
import path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import socketIo from 'socket.io';
import dotenv from 'dotenv';

import { SocketController } from './server/socket/socketController';
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

// setup socket, it's listeners and handlers
const socket = new SocketController(server, socketIo);
const chatHandler = new ChatHandler(socket.instance)
const userHandler = new UserHandler(socket.instance);

setTimeout(() => {
    userHandler.connectDb(mongoClient.instance, redisClient.instance);
    chatHandler.connectDb(mongoClient.instance, redisClient.instance);
    socket.connect({
        ChatListener: new ChatListener(chatHandler),
        UserListener: new UserListener(userHandler)
    });
    socket.attachAdapter(redisAdapter);
    server.listen(PORT, () => console.info(`Server listening on port ${PORT}`));
}, 1000);
