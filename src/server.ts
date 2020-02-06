import { createServer } from 'http';
import path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import socketIo from 'socket.io';

import { IOStatusEvents } from './constants';

const app = express();
const server = createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 900;

app.use(express.static(path.resolve(__dirname, '../dist/client')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../dist/client/index.html'));
});

io.on(IOStatusEvents.CONNECTION, (socket: socketIo.EngineSocket) => {
    console.log('user %s connected', socket.id)
});

server.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
