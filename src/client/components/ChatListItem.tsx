import React, { FC } from 'react';

interface PropType {
    userName: string
}

const ChatListItem: FC<PropType> = ({ userName }) => {

    return (
        <li className="chat-list-item">
            <p>{userName}</p>
        </li>
    );
 };

export default ChatListItem;
