import { FrStatus } from '../../constants'
export default class Helper {
    static clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    static get routeMediaQueries() {
        return {
            mobile: "(max-width: 719px)",
            tablet: "(min-width: 720px) and (max-width: 1079px)",
            desktop: "(min-width: 1080px) and (max-width: 1199px)",
            widescreen: "(min-width: 1200px)",
            landscape: "(orientation: landscape)"
        };
    }

    static fetchLocalStorageItem(item: string) {
        return JSON.parse(localStorage.getItem(item));
    }

    static removeLocalStorageItem(item: string) {
        localStorage.removeItem(item);
    }

    static addToLocalStorage(key: string, item: any) {
        localStorage.setItem(key, JSON.stringify(item));
    }

    static isEmptyOrNull(str: string) {
        return (!str || /^\s*$/.test(str));
    }

    static frMessage(person: string, status: string): string {
        if (status === FrStatus.NEW) {
            return `${person.toUpperCase()} sent a friend request`;
        }
        return `${person.toUpperCase()} ${status} your friend request`;
    }

    static sortAlphanumInAsc(...args: string[]) {
        const clone = Helper.clone(args);
        clone.sort((a: any, b: any) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
        return clone;
    };

    static genChatId(userId1: string, userId2: string) {
        return Helper.sortAlphanumInAsc(userId1, userId2).join('<>');
    }

    static timeStamp() {
        return new Date().toISOString();
    }

    static addToMessageRepo(newMessage: any, chatId: string, location: string) {
        const messagesRepo = Helper.fetchLocalStorageItem(location);
        if (!messagesRepo) {
            const message: any = [{ [`${chatId}`]: [] }];
            message[0][chatId].push(newMessage);
            Helper.addToLocalStorage(location, message);
            console.log('new output: ', message);
            return;
        }
        const currentChat = messagesRepo.find((item: any) => Object.keys(item)[0] === chatId);
        if (!currentChat) {
            const message: {[chatId: string]: any[]} = { [`${chatId}`]: [] };
            message[chatId].push(newMessage);
            const messageRepoClone = Helper.clone(messagesRepo);
            messageRepoClone.push(message);
            Helper.addToLocalStorage(location, messageRepoClone);
            return;
        }
        currentChat[chatId].push(newMessage);
        const output = messagesRepo.map((item: any) => {
            if (Object.keys(item)[0] === chatId) {
                item = currentChat
            }
            return item
        });
        console.log('existing output: ', output);
        Helper.addToLocalStorage(location, output);
    };

    static get noChatSelectedMessage() {
        return 'Select a friend from the friends list pane to the left to start chatting..'
    }
}