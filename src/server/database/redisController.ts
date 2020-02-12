import Redis from 'redis';
import adapter from 'socket.io-redis';
import SocketIORedis from 'socket.io-redis';
import bluebird from 'bluebird';

export default class RedisController {
    private redisInstance: Redis.RedisClient;

    constructor() {
        bluebird.promisifyAll(Redis);
        this.redisInstance = Redis.createClient(process.env.REDIS_URI);
    }

    public static initRedisAdapder(uri: string, opts?: SocketIORedis.SocketIORedisOptions ): adapter.RedisAdapter {
        return adapter(uri, opts);
    }

    get instance(): Redis.RedisClient {
        return this.redisInstance;
    }
}
