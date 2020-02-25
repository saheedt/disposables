import { createServer } from 'http';
import express from 'express';
import socketIo from 'socket.io';
import io from 'socket.io-client';
import { SocketController } from '../../server/socket/socketController';
import { ChatListener, UserListener } from '../../server/socket/listeners'
import { FakeChatHandler, FakeUserHandler } from './fakes';
import { UserEvents, ChatEvents } from '../../constants';
import { ChatHandler, UserHandler } from '../../server/socket/handlers';

describe('socket.io server', () => {
    const chatHandler = new FakeChatHandler() as unknown as ChatHandler;
    const userHandler = new FakeUserHandler() as unknown as UserHandler;

    const chatListener = new ChatListener(chatHandler);
    const userListener = new UserListener(userHandler);

    let client: SocketIOClient.Socket;
    beforeAll((done) => {
        const app = express();
        const server = createServer(app);
        const PORT = process.env.PORT || 4000;

        const socket = new SocketController(server, socketIo);
        socket.connect({
            ChatListener: chatListener,
            UserListener: userListener
        });
        server.listen(PORT, () => { console.log(`test server listening on port ${PORT}`) });
        // `http://${server.address().address}:${server.address().port}`
        const serverAddress = `http://localhost:${PORT}`;
        client = io(serverAddress);
        done();
    });
    // Investigate interesting behavior where only one it block passes once the
    // second block is introduced, except timeout is increased.
    it('should call handleReconnection', (done) => {
        spyOn(userHandler, 'handleReconnection');
        client.emit(UserEvents.USER_RECONNECT_DATA);
        setTimeout(() => {
            expect(userHandler.handleReconnection).toHaveBeenCalled();
            done();
        }, 200);
    });

    it('should call createUser', (done) => {
        spyOn(userHandler, 'createUser');
        client.emit(UserEvents.CREATE_USER);
        client.emit(UserEvents.CREATE_USER);
        setTimeout(() => {
            expect(userHandler.createUser).toHaveBeenCalledTimes(2);
            done();
        }, 200);
    });
});
