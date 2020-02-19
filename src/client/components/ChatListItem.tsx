import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ClientRoutes, LocalStorageKeys } from '../../constants';
import Helper from '../utils/helper';
import { SocketContext } from '../context/socketContext';
import { Subscription } from 'rxjs';

interface PropType {
    friendId: string,
    isActive: boolean,
    match: any,
    selectChat: any,
    userName: string,
}

const ChatListItem: FC<PropType> = ({ friendId, isActive, match, selectChat, userName }) => {
    const [isNewMessage, setIsNewMessage] = useState(false);
    const { CHAT, CHATPANE } = ClientRoutes;
    const { fetchLocalStorageItem } = Helper;
    const { USER_DATA } = LocalStorageKeys;

    const context = useContext(SocketContext);
    const onMessage = context.onMessage();

    useEffect(() => {
        const subscriptions: Subscription = new Subscription();
        subscriptions.add(onMessage.subscribe((im) => {
            if (im.from === friendId) {
                setIsNewMessage(true);
            }
        }));
        return () => {
            subscriptions.unsubscribe();
        }
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const user = fetchLocalStorageItem(USER_DATA);
        selectChat(friendId);
        if (isNewMessage) {
            setIsNewMessage(false);
        }
    }
    //
    return (
        <li className={`chat-list-item ${isNewMessage && !isActive ? 'new-message': ''}`} onClick={handleClick}>
            <Link to={`${match.url === `${CHAT}` ?
                `${match.url}${CHATPANE}`
                :
                match.url}`
            }>
                <p>{userName}</p>
            </Link>
        </li>
    );
 };

export default ChatListItem;
