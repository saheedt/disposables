import socketIo from 'socket.io';

import { ChatHandler } from '../handlers';
import { Listener } from '../../types';

export default class ChatListener implements Listener {
    private handler: ChatHandler

    constructor(handler: ChatHandler) {
        this.handler = handler;
    }
    listen(socket: socketIo.EngineSocket): void {

    }
}