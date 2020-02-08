import { default as mongo } from 'mongodb';

export default class UserHandler{
    private mongoInstance: mongo.MongoClient;

    connectDb(mongo: mongo.MongoClient): void {
        this.mongoInstance = mongo;
    }
 }
