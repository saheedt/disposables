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
    it('should call handleReconnection and supply right data', (done) => {
        spyOn(userHandler, 'handleReconnection');
        client.emit(UserEvents.USER_RECONNECT_DATA);
        setTimeout(() => {
            expect(userHandler.handleReconnection).toHaveBeenCalled();
            expect(userHandler.handleReconnection).toHaveBeenCalledWith(undefined, jasmine.anything());
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

    it('should call authenticateUser handler', (done) => {
        spyOn(userHandler, 'authenticateUser');
        client.emit(UserEvents.AUTH_USER);
        setTimeout(() => {
            expect(userHandler.authenticateUser).toHaveBeenCalled();
            done();
        }, 200);
    });

    it('should call userSearch handler with search data', (done) => {
        const searchTerm = { data: 'term' };
        spyOn(userHandler, 'userSearch');
        client.emit(UserEvents.USER_SEARCH, searchTerm);
        setTimeout(() => {
            expect(userHandler.userSearch).toHaveBeenCalledWith(searchTerm, jasmine.anything());
            done();
        }, 200);
    });

    it('should call friendRequest handler with empty friend data', (done) => {
        spyOn(userHandler, 'friendRequest');
        const friendData = {};
        client.emit(UserEvents.SEND_FRIEND_REQUEST, friendData);
        setTimeout(() => {
            expect(userHandler.friendRequest).toHaveBeenCalled();
            expect(userHandler.friendRequest).toHaveBeenCalledWith(friendData, jasmine.anything());
            done();
        }, 200);
    });

    it('should call acceptFriendRequest handler with null friend data', (done) => {
        spyOn(userHandler, 'acceptFriendRequest');
        const friendData: null = null ;
        client.emit(UserEvents.ACCEPT_FRIEND_REQUEST, friendData);
        setTimeout(() => {
            expect(userHandler.acceptFriendRequest).toHaveBeenCalled();
            expect(userHandler.acceptFriendRequest).toHaveBeenCalledWith(friendData, jasmine.anything());
            done();
        }, 200);
    });

    it('should call rejectFriendRequest handler with null friend data', (done) => {
        spyOn(userHandler, 'acceptFriendRequest');
        const friendData = {friendId: 'abc'};
        client.emit(UserEvents.ACCEPT_FRIEND_REQUEST, friendData);
        setTimeout(() => {
            expect(userHandler.acceptFriendRequest).toHaveBeenCalled();
            expect(userHandler.acceptFriendRequest).toHaveBeenCalledWith({ friendId: jasmine.stringMatching(friendData.friendId)}, jasmine.anything());
            done();
        }, 200);
    });
});
