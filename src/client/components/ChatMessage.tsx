import React, { FC } from 'react';

interface PropType {
    message: string
    time: string
    isIncoming: boolean
}

const ChatMessage: FC<PropType> = ({ message, time, isIncoming }) => {

    return (
        <li className={`${isIncoming ? 'incoming' : 'author'}`}>
            <p>{message}</p>
            <p><span>{time}</span></p>
        </li>
    );
}

export default ChatMessage;