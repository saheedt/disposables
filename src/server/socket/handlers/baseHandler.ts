import { default as mongo } from 'mongodb';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserErrorMesssages } from '../../../constants';

export default class BaseHandler {

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
}
