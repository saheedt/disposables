import { Server } from 'http';
import socketIo from 'socket.io';

import { Listeners } from '../types';
import { IoStatusEvents } from '../../constants';

export class SocketController {
    private io: socketIo.Server;

    constructor(server: Server, socketIO: any) {
        this.initSocket(server, socketIO);
    }

    private initSocket(server: Server, socketIoInstance: any): void {
        console.log('init socket..');
        this.io = socketIoInstance(server);
    }

    connect(listeners: Listeners): void {
        const userListerner = listeners.UserListener;
        const chatListener = listeners.ChatListener;
        this.io.on(IoStatusEvents.CONNECTION, (socket: any) => {
            console.log('connected:', socket.id);
            userListerner.listen(socket);
            chatListener.listen(socket);
        });
    }

    attachAdapter(adapter: any): void {
        this.io.adapter(adapter);
    }
}
