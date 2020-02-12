import React, { FC } from 'react';

interface PropType {
    userName: string
}

const ChatListItem: FC<PropType> = ({ userName }) => {

    return (
        <li>
            <p>{userName}</p>
        </li>
    );
 };

export default ChatListItem;
