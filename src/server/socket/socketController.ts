import { Server } from 'http';
import socketIo from 'socket.io';

import { Listeners } from '../types';
import { IoStatusEvents, UserEvents } from '../../constants';

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
            console.info('connected:', socket.id);
            socket.on(UserEvents.USER_RECONNECT_DATA, (data: any) => {
                userListerner.handlerInstance.handleReconnection(data, socket);
             });
            userListerner.listen(socket);
            chatListener.listen(socket);
        });
        // this.io.sockets.sockets[''].emit()
    }

    attachAdapter(adapter: any): void {
        this.io.adapter(adapter);
    }

    get instance(): socketIo.Server {
        return this.io
    }
}
