import { default as mongo } from 'mongodb';

export default class MongoController {
    private mongoInstance: mongo.MongoClient
    constructor() {
        console.log("[mongo URI]: ", process.env['MONGO_URI'])
        const uri = process.env['MONGO_URI'];
        this.mongoInstance = new mongo.MongoClient(uri)
    }

    get instance(): mongo.MongoClient {
        return this.mongoInstance;
    }

    close(): void {
        this.mongoInstance.close(true);
    }
}
