import socketIo from 'socket.io';
import { ChatListener, UserListener } from './socket/listeners';
import { MongoController, RedisController } from './database';
import { UserHandler, ChatHandler } from './socket/handlers';

export interface Listener {
    listen(s: socketIo.EngineSocket, db: any): void
}

export interface Listeners {
    UserListener: UserListener
    ChatListener: ChatListener
}

export interface Databases {
    mongo?: MongoController
    redis?: RedisController
}
