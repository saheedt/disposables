import socketIo from 'socket.io';

import { ChatHandler } from '../handlers';
import { Listener } from '../../types';

import { ChatEvents } from '../../../constants';

export default class ChatListener implements Listener {
    private handler: ChatHandler

    constructor(handler: ChatHandler) {
        this.handler = handler;
    }

    listen(socket: socketIo.EngineSocket): void {
        socket.on(ChatEvents.OUTGOING_IM, (data: any) => this.handler.outGoingIm(data, socket));
    }
}