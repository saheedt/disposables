import { Server } from 'http';
import socketIo from 'socket.io';

import { IoStatusEvents } from '../../constants';

export class SocketController {
    private io: socketIo.Server;

    constructor(server: Server, socketIO: any) {
        this.initSocket(server, socketIO);
    }

    private initSocket(server: Server, socketIoInstance: any): void {
        this.io = socketIoInstance(server);
    }

    connect(listeners: any): void {
        const userListerner = new listeners.UserListerner();
        const chatListener = new listeners.ChatListener();
        this.io.on(IoStatusEvents.CONNECTION, (socket: socketIo.EngineSocket) => {
            userListerner.listen(socket);
            chatListener.listen(socket);
         });
    }
}
