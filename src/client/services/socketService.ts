import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';

import { ChatEvents, UserEvents } from '../../constants';

export class SocketService {
    socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    init(port: string | number): SocketService {
        console.log('opening socket in client');
        this.socket = io(`localhost:${port}`);
        console.log('SocketService instance: ', this)
        return this;
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

    send(event: string, data: any): void {
        this.socket.emit(event, data);
    }
 }
