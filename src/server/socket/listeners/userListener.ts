import socketIo from 'socket.io';

import { UserHandler } from '../handlers';
import { Listener } from '../../types';

import { UserEvents } from '../../../constants';

export default class UserListerner implements Listener {
    private handler: UserHandler

    constructor(handler: UserHandler) {
        this.handler = handler;
    }

    listen(socket: socketIo.EngineSocket): void {
        socket.on(UserEvents.USER_RECONNECT_DATA, (data: any) => this.handler.handleReconnection(data, socket));
        socket.on(UserEvents.CREATE_USER, (user: any) => this.handler.createUser(user, socket));
        socket.on(UserEvents.AUTH_USER, (user: any) => this.handler.authenticateUser(user, socket));
        socket.on(UserEvents.USER_SEARCH, (searchTerm: any) => this.handler.userSearch(searchTerm, socket));
        socket.on(UserEvents.SEND_FRIEND_REQUEST, (data: any) => this.handler.friendRequest(data, socket));
        socket.on(UserEvents.ACCEPT_FRIEND_REQUEST, (data: any) => this.handler.acceptFriendRequest(data, socket));
        socket.on(UserEvents.REJECT_FRIEND_REQUEST, (data: any) => this.handler.rejectFriendRequest(data, socket));
        socket.on(UserEvents.FETCH_FRIENDS_LIST, (data: any) => this.handler.fetchFriendsList(data, socket));
        socket.on(UserEvents.FETCH_FRIEND_REQUESTS, (data: any) => this.handler.fetchFriendRequests(data, socket))
        socket.on('disconnect', (reason: any) => {
            console.log('server disonnect reason: ', reason);
        });
    }
}
