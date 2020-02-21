import { default as mongo } from 'mongodb';

export default class MongoController {
    private mongoInstance: mongo.MongoClient
    private dBInstance: mongo.Db;

    constructor() {
        console.log("[mongo URI]: ", process.env.MONGO_URI)
        const uri = process.env.MONGO_URI;
        mongo.MongoClient.connect(uri, { useNewUrlParser: true })
            .then(client => {
                if (client)
                    this.mongoInstance = client;
                    this.dBInstance = this.mongoInstance.db(process.env.MONGO_DB_NAME);
            })
            .catch(e => {
                // TODO: Implement user friendly error messages to send back to client
                // Also socket should be closed here?..
                // { code: 500, message: 'Internal server error' };
                console.error('error connecting to db: ', e)
            });

    }

    get instance(): mongo.Db {
        return this.dBInstance;
    }

    close(): void {
        this.mongoInstance.close(true);
    }
}
