import socketIo from 'socket.io';
export interface Listener {
    listen(s: socketIo.EngineSocket): void
}