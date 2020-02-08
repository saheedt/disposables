import adapter from 'socket.io-redis';
import SocketIORedis from 'socket.io-redis';

export default class RedisController {
    initRedisAdapder(uri: string, opts?: SocketIORedis.SocketIORedisOptions ): adapter.RedisAdapter {
        return adapter(uri, opts);
    }
}
