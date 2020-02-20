import socketIo from 'socket.io';
import { default as mongo } from 'mongodb';
import Redis from 'redis';
// import uuid from 'uuid/v5';

import { DbCollections, UserEvents, UserErrorMesssages, StatusCodes, IoStatusEvents } from '../../../constants';
import BaseHandler from './baseHandler';


export default class UserHandler extends BaseHandler {
    dBInstance: mongo.Db;
    private redisInstance: any;
    private socketServerInstance: socketIo.Server

    constructor(socketServerInstance: socketIo.Server) {
        super();
        this.socketServerInstance = socketServerInstance;
    }

    connectDb(dBInstance: mongo.Db, redisInstance: any): void {
        this.dBInstance = dBInstance;
        this.redisInstance = redisInstance;
        super.connectDataBase(dBInstance);
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
                update: { $push: { friendRequest: { requester: data.requestInitiator.data._id } } }
            };

            const toRequester = {
                filter: { _id: new mongo.ObjectID(data.requestInitiator.data._id) },
                update: { $push: { friendsList: { friendId: data.friendId } } }
            };
            const requesterFriendsList = verifiedAndExists.user.friendsList;
            if (requesterFriendsList && requesterFriendsList.length > 0) {
                const isAlreadyFriend = requesterFriendsList.find((friend: any) => friend.friendId === data.friendId);
                if (isAlreadyFriend) {
                    socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: UserErrorMesssages.FRIEND_REQUEST_ERROR
                    });
                    return;
                }
            }

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
                socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: UserErrorMesssages.FRIEND_REQUEST_ERROR
                });
                return;
            }
            socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: UserErrorMesssages.FRIEND_REQUEST_ERROR
            });
            return;
        }
    }

    async acceptFriendRequest(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data.userData, socket);
        if (verifiedAndExists.verified) {
            const removeFromRequestList = {
                filter: { _id: new mongo.ObjectID(verifiedAndExists.user._id) },
                update: { $pull: { friendRequest: { requester: data.friendId } } }
            };

            const addToFriendsList = {
                filter: { _id: new mongo.ObjectID(verifiedAndExists.user._id) },
                update: { $push: { friendsList: { friendId: data.friendId } } }
            };

            const removeFromRequest = await this.findAndUpdate(removeFromRequestList, DbCollections.users);
            if (removeFromRequest) {
                const addToFriends = await this.findAndUpdate(addToFriendsList, DbCollections.users);
                if (addToFriends) {
                    const requesterSocketId = await this.redisInstance.getAsync(data.friendId);
                    this.socketServerInstance.to(requesterSocketId).emit(UserEvents.FRIEND_REQUEST_ACCEPTED, {
                        code: StatusCodes.OK,
                        by: verifiedAndExists.user.userName
                    });
                    socket.emit(UserEvents.FRIEND_REQUEST_ACCEPTED, { code: StatusCodes.OK });
                    return;
                }
                // add to friend list error
                socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: UserErrorMesssages.FRIEND_REQUEST_ERROR
                });
                return;
            }
            // removal from friend request error
            socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: UserErrorMesssages.FRIEND_REQUEST_ERROR
            });
            return;
        }
    }

    async rejectFriendRequest(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data.userData, socket);
        if (verifiedAndExists.verified) {
            const removeFromRequestList = {
                filter: { _id: new mongo.ObjectID(verifiedAndExists.user._id) },
                update: { $pull: { friendRequest: { requester: data.friendId } } }
            };

            const removeFromRequesterFriendsList = {
                filter: { _id: new mongo.ObjectID(data.friendId) },
                update: { $pull: { friendsList: { friendId: new mongo.ObjectID(verifiedAndExists.user._id) } } }
            };

            const removeFromRequest = await this.findAndUpdate(removeFromRequestList, DbCollections.users);
            if (removeFromRequest) {
                const removeFromRequesterFriends = await this.findAndUpdate(removeFromRequesterFriendsList, DbCollections.users);
                if (removeFromRequesterFriends) {
                    const requesterSocketId = await this.redisInstance.getAsync(data.friendId);
                    this.socketServerInstance.to(requesterSocketId).emit(UserEvents.FRIEND_REQUEST_REJECTED, {
                        code: StatusCodes.OK,
                        by: verifiedAndExists.user.userName
                    });
                    socket.emit(UserEvents.FRIEND_REQUEST_REJECTED, { code: StatusCodes.OK });
                    return;
                }
                // emit error rejecting request notification
                socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: UserErrorMesssages.FRIEND_REQUEST_ERROR
                });
                return;
            }
            // emit error rejecting request notification
            socket.emit(UserEvents.FRIEND_REQUEST_ERROR, {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: UserErrorMesssages.FRIEND_REQUEST_ERROR
            });
        }
    }

    async fetchFriendRequests(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data, socket);
        if (verifiedAndExists.verified) {
            const friendRequests = verifiedAndExists.user.friendRequest.length > 0 && verifiedAndExists.user.friendRequest
                .map((friend: { [friendId: string]: string }) => (new mongo.ObjectID(friend.friendId)));

            if (friendRequests.length > 0) {
                const isBulkFetch = true;
                const query = { _id: { $in: friendRequests } };
                const all = await this.find(query, DbCollections.users, isBulkFetch);
                const processed = all.map((user: any) => ({ friendId: user._id, userName: user.userName }));
                socket.emit(UserEvents.FETCH_FRIEND_REQUESTS_SUCCESS, {
                    code: StatusCodes.OK,
                    friendRequests: processed
                });
                return;
            }
            socket.emit(UserEvents.FETCH_FRIEND_REQUESTS_SUCCESS, {
                code: StatusCodes.OK,
                friendRequests: []
            });
            return;
        }
    }

    async fetchFriendsList(data: any, socket: socketIo.EngineSocket) {
        const verifiedAndExists = await this.userVerifiedAndExists(data, socket);
        if (verifiedAndExists.verified) {
            const friendsList = verifiedAndExists.user.friendsList.length > 0 && verifiedAndExists.user.friendsList
                .map((friend: { [friendId: string]: string }) => ( new mongo.ObjectID(friend.friendId) ));

            if (friendsList.length > 0) {
                const isBulkFetch = true;
                const query = { _id: { $in: friendsList}};
                const all = await this.find(query, DbCollections.users, isBulkFetch);
                const processed = all.map((user: any) => ({_id: user._id, userName: user.userName}));
                socket.emit(UserEvents.FETCH_FRIENDS_LIST_SUCCESS, {
                    code: StatusCodes.OK,
                    friendsList: processed
                });
                return;
            }
            socket.emit(UserEvents.FETCH_FRIENDS_LIST_SUCCESS, {
                code: StatusCodes.OK,
                friendsList: []
            });
            return;
        }
    }

    /** */
    // Do not return self on search, hence the filter..
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
