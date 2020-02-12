import React, { FC } from 'react';

interface PropType {
    message: string
    time: string
}

const ChatMessage: FC<PropType> = ({ message, time }) => {

    return (
        <li className="chat-message-item">
            <p>{message}</p>
            <p><span>{time}</span></p>
        </li>
    );
}

export default ChatMessage;