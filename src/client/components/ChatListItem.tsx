import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { ClientRoutes, LocalStorageKeys } from '../../constants';
import Helper from '../utils/helper';
interface PropType {
    id: string,
    match: any,
    selectChat: any,
    userName: string,
}

const ChatListItem: FC<PropType> = ({ id , match, selectChat, userName }) => {
    const { CHAT, CHATPANE } = ClientRoutes;
    const { fetchLocalStorageItem } = Helper;
    const { USER_DATA } = LocalStorageKeys;
    const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        console.log('selected friend _id: ', id);
        const user = fetchLocalStorageItem(USER_DATA);
        console.log('by friend _id: ', user.data._id);
        selectChat(id, user.data._id);
    }
    //
    return (
        <li className="chat-list-item" onClick={handleClick}>
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
