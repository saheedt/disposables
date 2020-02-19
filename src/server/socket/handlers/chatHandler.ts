import socketIo from 'socket.io';
import { default as mongo } from 'mongodb';

import BaseHandler from './baseHandler';
import { ChatEvents } from '../../../constants';

export default class ChatHandler extends BaseHandler {
    dBInstance: mongo.Db;
    private socketServerInstance: socketIo.Server;
    private redisInstance: any;

    constructor(socketServerInstance: socketIo.Server) {
        super();
        this.socketServerInstance = socketServerInstance;
    }

    connectDb(dBInstance: mongo.Db, redisInstance: any) {
        this.dBInstance = dBInstance;
        this.redisInstance = redisInstance;
    }

    async outGoingIm(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data.user, socket);
        if (verifiedAndExists.verified) {
            const recepientsocketId = await this.redisInstance.getAsync(data.chat.to);
            this.socketServerInstance.to(recepientsocketId).emit(ChatEvents.INCOMING_IM, data.chat);
        }
    }
}