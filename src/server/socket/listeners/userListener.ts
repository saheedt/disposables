import socketIo from 'socket.io';

import { UserHandler } from '../handlers';
import { Listener } from '../../types';

import { } from '../../../constants';

export default class UserListerner implements Listener {
    private handler: UserHandler

    constructor(handler: UserHandler) {
        this.handler = handler
    }
    listen(socket: any): void {
        socket.on('handle_reconnection', (data: any) => { console.log(data) });
        socket.on('disconnect', (reason: any) => {
            console.log('server disonnect reason: ', reason);
            console.log('disconnecting user: ', socket.ourUser)
         });
    }
}
