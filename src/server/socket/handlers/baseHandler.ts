import socketIo from 'socket.io';
import { default as mongo } from 'mongodb';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { DbCollections, StatusCodes, UserErrorMesssages, UserEvents } from '../../../constants';

export default class BaseHandler {

    dBInstance: mongo.Db;

    connectDataBase(dBInstance: mongo.Db) {
        this.dBInstance = dBInstance;
    }

    isEmptyOrNull(str: string) {
        return (!str || /^\s*$/.test(str));
    }

    isValidPassword(password: string) {
        if (this.isEmptyOrNull(password)) {
            return false;
        }
        if (password.length < 6) {
            return false;
        }
        return true;
    }

    isEmail(email: string) {
        return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
            .test(email);
    }

    async hashPassWord(password: string): Promise<string> {
        try {
            const passwordHash = await hash(password, parseInt(process.env.SALT_ROUND, 10));
            return passwordHash;
        } catch (error) {
            console.error('[Error]: ', 'Error hashing password ', error);
            return null;
        }
    }

    async verifyPassword(unEncrypted: string, encrypted: string): Promise<Boolean> {
        try {
            const match = await compare(unEncrypted, encrypted);
            return match;
        } catch (error) {
            console.error('[Error]: ', 'Error comparing passwords ', error);
            return null;
        }
    }

    generateToken(data: any, exipry = '12 weeks'): string {
        try {
            return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: exipry });
        } catch (error) {
            console.error('[Error]: ', 'Error generating token ', error);
            return null;
        }
    }

    verifyToken(token: string, secret: string): any {
        try {
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (error) {
            console.error('[Error]: ', 'Error verifying token ', error);
            return UserErrorMesssages.AUTH_INVALID_TOKEN;
        }
    }

    clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }
    async userVerifiedAndExists(data: any, socket: socketIo.EngineSocket) {
        const authorizedUser = this.verifyToken(data.token, process.env.JWT_SECRET);
        if (authorizedUser === UserErrorMesssages.AUTH_INVALID_TOKEN) {
            socket.emit(UserEvents.USER_UNAUTHORIZED, {
                code: StatusCodes.UNAUTHORIZED,
                message: UserErrorMesssages.USER_UNAUTHORIZED
            });
            return { verified: false };
        }
        const userExists = await this.find({ _id: new mongo.ObjectID(authorizedUser._id) }, DbCollections.users);
        if (userExists) {
            socket.emit(UserEvents.USER_AUTHORIZED)
            return { verified: true, user: userExists };
        }
        socket.emit(UserEvents.USER_UNAUTHORIZED, {
            code: StatusCodes.UNAUTHORIZED,
            message: UserErrorMesssages.USER_UNAUTHORIZED
        });
        return { verified: false };
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
}
