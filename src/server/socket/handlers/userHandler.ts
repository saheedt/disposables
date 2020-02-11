import socketIo from 'socket.io';
import { default as mongo } from 'mongodb';
import uuid from 'uuid/v5';

import { DbCollections, UserEvents, UserErrors, StatusCodes } from '../../../constants';
import BaseHandler from './baseHandler';


export default class UserHandler extends BaseHandler {
    private dBInstance: mongo.Db;

    constructor() {
        super();
    }

    connectDb(dBInstance: mongo.Db): void {
       this.dBInstance = dBInstance;
    }

    async createUser(userData: any, socket: socketIo.EngineSocket) {
        console.log('incoming user: ', userData);
        if (this.isEmptyOrNull(userData.email) || !this.isEmail(userData.email)) {
            socket.emit(UserEvents.CREATE_USER_ERROR, {
                code: StatusCodes.BAD_REQUEST,
                message: UserErrors.CREATE_USER_ERROR_CREDENTIALS
            });
            return;
        }
        if (!this.isValidPassword(userData.password)) {
            socket.emit(UserEvents.CREATE_USER_ERROR, {
                code: StatusCodes.BAD_REQUEST,
                message: UserErrors.CREATE_USER_ERROR_CREDENTIALS
            });
            return;
        }
        const isExisting = await this.find({ email: userData.email }, DbCollections.users);

        if (!isExisting) {
            const passwordHash = await this.hashPassWord(userData.password);
            if (!passwordHash) {
                // emit error and return...
                socket.emit(UserEvents.CREATE_USER_ERROR,
                    {
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: UserErrors.CREATE_USER_ERROR_SERVER
                    });
                return;
            }
            const insertRecord = {
                email: userData.email,
                userName: userData.userName,
                password: passwordHash
            }
            const response = await this.insert(insertRecord, DbCollections.users);
            if (response.result.ok) {
                delete insertRecord.password
                const toToken = this.clone(insertRecord);
                toToken._id = response.ops[0]._id
                const token = this.generateToken(toToken);
                socket.emit(UserEvents.CREATE_USER_SUCCESS, {
                    code: StatusCodes.CREATED,
                    data: {
                        token,
                        email: toToken.email,
                        userName: toToken.userName,
                        _id: toToken._id
                    }
                })
            }
            return;
        }
        socket.emit(UserEvents.CREATE_USER_ERROR, {
            code: StatusCodes.OK,
            message: UserErrors.CREATE_USER_ERROR_DUPLICATE
        })
    }

    async find(record: any, from: string, isMultiple = false) {
        const collection = this.dBInstance.collection(from);
        let result;
        try {
            if (isMultiple) {
                return result = await collection.find(record);
            }
            return result = collection.findOne(record);
        } catch (error) {
            console.error('[Error]: Find error ', error);
            return error;
        }
    }

    async insert(record: any | any[], into: string, isMultiple = false) {
        const collection = this.dBInstance.collection(into)
        let result;
        try {
            if (isMultiple) {
                return result = await collection.insertMany(record);
            }
            return result = await collection.insertOne(record);
        } catch (error) {
            console.error('[Error]: Insert error ', error);
            return error
        }
    }
 }
