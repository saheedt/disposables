import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { ClientRoutes } from '../../constants';
interface PropType {
    userName: string,
    match: any,
    id: string
}

const ChatListItem: FC<PropType> = ({ userName, match, id }) => {
    const { CHAT, CHATPANE } = ClientRoutes;
    const handleClick = (e: any) => {
        console.log('selected friend _id: ', id);
    }

    return (
        <li className="chat-list-item" onClick={handleClick}>
            <Link to={
                `${match.url === `${CHAT}` ? `${match.url}${CHATPANE}` : match.url }`
            }>
                <p>{userName}</p>
            </Link>
        </li>
    );
 };

export default ChatListItem;
