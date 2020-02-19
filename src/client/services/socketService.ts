import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';



import { IoStatusEvents, ChatEvents, UserEvents } from '../../constants';

export class SocketService {
    socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    init(port: string | number): SocketService {
        console.log('opening socket in client');
        this.socket = io(`localhost:${port}`);
        return this;
    }

    onConnection(): Observable<any> {
        return fromEvent(this.socket, 'connect');
    }
    // SUpply appropriate types..
    onMessage(): Observable<any> {
        return fromEvent(this.socket, ChatEvents.INCOMING_IM);
    }

    onSIgnUpSuccess(): Observable<any> {
        return fromEvent(this.socket, UserEvents.CREATE_USER_SUCCESS);
    }

    onSignUpError(): Observable<any> {
        return fromEvent(this.socket, UserEvents.CREATE_USER_ERROR);
    }

    onLoginSuccess(): Observable<any> {
        return fromEvent(this.socket, UserEvents.AUTH_USER_SUCCESS);
    }

    onLoginError(): Observable<any> {
        return fromEvent(this.socket, UserEvents.AUTH_USER_ERROR);
    }

    onReconnect(): Observable<any> {
        return fromEvent(this.socket, IoStatusEvents.RECONNECT)
    }

    onUserSocketSyncSuccess(): Observable<any> {
        return fromEvent(this.socket, UserEvents.USER_SOCKET_SYNC_SUCCESS);
    }

    onUserSocketSyncError(): Observable<any> {
        return fromEvent(this.socket, UserEvents.USER_SOCKET_SYNC_ERROR);
    }

    onUserUnAuthorized(): Observable<any> {
        return fromEvent(this.socket, UserEvents.USER_UNAUTHORIZED)
    }

    onUserSearchResponse(): Observable<any> {
        return fromEvent(this.socket, UserEvents.USER_SEARCH_RESPONSE);
    }

    onNewFriendRequest(): Observable<any> {
        return fromEvent(this.socket, UserEvents.NEW_FRIEND_REQUEST);
    }

    onFriendRequestAccepted(): Observable<any> {
        return fromEvent(this.socket, UserEvents.FRIEND_REQUEST_ACCEPTED)
    }

    onFriendRequestRejected(): Observable<any> {
        return fromEvent(this.socket, UserEvents.FRIEND_REQUEST_REJECTED)
    }

    onFriendRequestError(): Observable<any> {
        return fromEvent(this.socket, UserEvents.FRIEND_REQUEST_ERROR);
    }

    onFetchFriendRequestsSuccess(): Observable<any> {
        return fromEvent(this.socket, UserEvents.FETCH_FRIEND_REQUESTS_SUCCESS);
    }

    onFetchFriendsListSuccess(): Observable<any> {
        return fromEvent(this.socket, UserEvents.FETCH_FRIENDS_LIST_SUCCESS);
    }

    send(event: string, data: any): void {
        this.socket.emit(event, data);
    }
 }
