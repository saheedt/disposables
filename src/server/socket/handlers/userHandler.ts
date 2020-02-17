import socketIo from 'socket.io';
import { default as mongo } from 'mongodb';
import Redis from 'redis';
// import uuid from 'uuid/v5';

import { DbCollections, UserEvents, UserErrorMesssages, StatusCodes, IoStatusEvents } from '../../../constants';
import BaseHandler from './baseHandler';


export default class UserHandler extends BaseHandler {
    private dBInstance: mongo.Db;
    private redisInstance: any;
    private socketServerInstance: socketIo.Server

    constructor(socketServerInstance: socketIo.Server) {
        super();
        this.socketServerInstance = socketServerInstance;
    }

    connectDb(dBInstance: mongo.Db, redisInstance: any): void {
        this.dBInstance = dBInstance;
        this.redisInstance = redisInstance;
    }

    // TODO: define expected userData object type..
    async createUser(userData: any, socket: socketIo.EngineSocket) {
        if (this.isEmptyOrNull(userData.email) || !this.isEmail(userData.email)) {
            socket.emit(UserEvents.CREATE_USER_ERROR, {
                code: StatusCodes.BAD_REQUEST,
                message: UserErrorMesssages.USER_ERROR_CREDENTIALS
            });
            return;
        }
        if (!this.isValidPassword(userData.password)) {
            socket.emit(UserEvents.CREATE_USER_ERROR, {
                code: StatusCodes.BAD_REQUEST,
                message: UserErrorMesssages.USER_ERROR_PASSWORD
            });
            return;
        }
        const isExisting = await this.find({ email: userData.email }, DbCollections.users);

        if (!isExisting) {
            const isUserNameTaken = await this.find({ userName: userData.userName }, DbCollections.users);
            if (isUserNameTaken) {
                socket.emit(UserEvents.CREATE_USER_ERROR,
                    {
                        code: StatusCodes.OK,
                        message: UserErrorMesssages.CREATE_USER_ERROR_DUPLICATE_USERNAME
                    });
                return;
            }
            const passwordHash = await this.hashPassWord(userData.password);
            if (!passwordHash) {
                // emit error and return...
                socket.emit(UserEvents.CREATE_USER_ERROR,
                    {
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: UserErrorMesssages.CREATE_USER_ERROR_SERVER
                    });
                return;
            }
            const insertRecord = {
                email: userData.email,
                userName: userData.userName,
                password: passwordHash,
                friendsList: [] as [],
                friendRequest: [] as []
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
                        _id: toToken._id,
                        email: toToken.email,
                        userName: toToken.userName
                    },
                    token
                });
                const userSocketSync = await this.redisInstance.setAsync(toToken._id.toString(), socket.id);
                if (userSocketSync !== "OK") {
                    socket.emit(UserEvents.USER_SOCKET_SYNC_ERROR);
                    return;
                }
                socket.emit(UserEvents.USER_SOCKET_SYNC_SUCCESS, { user: toToken.userName, socketId: socket.id });
            }
            return;
        }
        socket.emit(UserEvents.CREATE_USER_ERROR, {
            code: StatusCodes.OK,
            message: UserErrorMesssages.CREATE_USER_ERROR_DUPLICATE_EMAIL
        })
    }

    async authenticateUser(authData: any, socket: socketIo.EngineSocket) {
        if (this.isEmptyOrNull(authData.email) || !this.isEmail(authData.email)) {
            socket.emit(UserEvents.AUTH_USER_ERROR, {
                code: StatusCodes.BAD_REQUEST,
                message: UserErrorMesssages.USER_ERROR_CREDENTIALS
            });
            return;
        }
        if (!this.isValidPassword(authData.password)) {
            socket.emit(UserEvents.AUTH_USER_ERROR, {
                code: StatusCodes.BAD_REQUEST,
                message: UserErrorMesssages.USER_ERROR_CREDENTIALS
            });
            return;
        }
        const isExisting = await this.find({ email: authData.email }, DbCollections.users);
        if (isExisting) {
            const match = await this.verifyPassword(authData.password, isExisting.password);
            if (!match) {
                socket.emit(UserEvents.AUTH_USER_ERROR, {
                    code: StatusCodes.BAD_REQUEST,
                    message: UserErrorMesssages.USER_ERROR_CREDENTIALS
                });
                return;
            }

            const toToken = this.clone(isExisting);
            delete toToken.password;
            const token = this.generateToken(toToken);
            socket.emit(UserEvents.AUTH_USER_SUCCESS, {
                code: StatusCodes.OK,
                data: toToken,
                token
            });

            const userSocketSync = await this.redisInstance.setAsync(toToken._id.toString(), socket.id);
            if (userSocketSync !== "OK") {
                socket.emit(UserEvents.USER_SOCKET_SYNC_ERROR);
                return;
            }
            socket.emit(UserEvents.USER_SOCKET_SYNC_SUCCESS, { user: toToken.userName, socketId: socket.id });
            return;
        }

        socket.emit(UserEvents.AUTH_USER_ERROR, {
            code: StatusCodes.NOT_FOUND,
            message: UserErrorMesssages.AUTH_USER_ERROR_NON_EXISTENT
        });

    }

    /** */

    async userVerifiedAndExists(data: any, socket: socketIo.EngineSocket) {
        const authorizedUser = this.verifyToken(data.token, process.env.JWT_SECRET);
        if (authorizedUser === UserErrorMesssages.AUTH_INVALID_TOKEN) {
            socket.emit(UserEvents.USER_UNAUTHORIZED, {
                code: StatusCodes.UNAUTHORIZED,
                message: UserErrorMesssages.USER_UNAUTHORIZED
            });
            return {verified: false};
        }
        const userExists = await this.find({ _id: new mongo.ObjectID(authorizedUser._id) }, DbCollections.users);
        if (userExists) {
            socket.emit(UserEvents.USER_AUTHORIZED)
            return { verified: true, user: userExists };
        }
        socket.emit(UserEvents.USER_UNAUTHORIZED);
        return { verified: false };
    }

    async handleReconnection(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data, socket);
        if (verifiedAndExists.verified) {
            const userSocketSync = await this.redisInstance.setAsync(verifiedAndExists.user._id.toString(), socket.id);
            if (userSocketSync !== "OK") {
                socket.emit(UserEvents.USER_SOCKET_SYNC_ERROR);
                return;
            }
            socket.emit(UserEvents.USER_SOCKET_SYNC_SUCCESS, { user: verifiedAndExists.user.userName, socketId: socket.id });
            return;
        }
    }

    async friendRequest(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data.requestInitiator, socket);
        if (verifiedAndExists.verified) {
            const toRequestee = {
                filter: { _id: new mongo.ObjectID(data.friendId) },
                update: { $push: { friendRequest: { requester: data.requestInitiator.data._id } } },
            };

            const toRequester = {
                filter: { _id: new mongo.ObjectID(data.requestInitiator.data._id) },
                update: { $push: { friendsList: { friendId: data.friendId } } }
            };

            const sendToRequestee = await this.findAndUpdate(toRequestee, DbCollections.users);
            if (sendToRequestee) {
                const sendToRequester = await this.findAndUpdate(toRequester, DbCollections.users);
                if (sendToRequester) {
                    const requesteeSocketId = await this.redisInstance.getAsync(data.friendId);
                    this.socketServerInstance.to(requesteeSocketId).emit(UserEvents.NEW_FRIEND_REQUEST, {
                            friendId: data.requestInitiator.data._id,
                            userName: data.requestInitiator.data.userName
                    });
                    return;
                }
                socket.emit(UserEvents.FRIEND_REQUEST_ERROR);
                return;
            }
            socket.emit(UserEvents.FRIEND_REQUEST_ERROR);
            return;
        }
    }

    /** */
    // change incoming to include current user _id to compare items
    async userSearch(record: any, socket: socketIo.EngineSocket) {
        const textQuery = { $text: { $search: record.searchTerm }};
        const result = await this.find(textQuery, DbCollections.users, true);
        const processed = result.length > 0 ?
            result.map((item: any) => {
                delete item.password;
                return item
            }).filter((item: any) => item._id.toString() !== record.user_id )
            : []
        socket.emit(UserEvents.USER_SEARCH_RESPONSE, { response: processed});
    }

    async find(record: any | any[], from: string, isMultiple = false) {
        const collection = this.dBInstance.collection(from);
        let result;
        try {
            if (isMultiple) {
                result = await collection.find(record);
                return result.toArray();
            }
            return result = collection.findOne(record);
        } catch (error) {
            console.error('[Error]: Find error ', error);
            return null;
        }
    }

    async findAndUpdate(record: any, from: string) {
        const collection = this.dBInstance.collection(from);
        try {
            const result = await collection.findOneAndUpdate(record.filter, record.update);
            return result;
        } catch (error) {
            console.log('[Error]: FindOneAndUpdate error ', error);
            return null;
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
            return null;
        }
    }

 }
