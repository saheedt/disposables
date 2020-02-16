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
        return fromEvent(this.socket, ChatEvents.MESSAGE);
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

    // onAddUserToListSuccess(): Observable<any> {
    //     return fromEvent(this.socket, UserEvents.ADD_USER_TO_LIST_SUCCESS);
    // }

    onNewFriendRequest(): Observable<any> {
        return fromEvent(this.socket, UserEvents.NEW_FRIEND_REQUEST);
    }

    onFriendRequestError(): Observable<any> {
        return fromEvent(this.socket, UserEvents.FRIEND_REQUEST_ERROR);
    }

    send(event: string, data: any): void {
        this.socket.emit(event, data);
    }
 }
