import React, { FC } from 'react';
import Moment from 'react-moment';

interface PropType {
    message: string
    time: string
    isIncoming: boolean
}

const ChatMessage: FC<PropType> = ({ message, time, isIncoming }) => {

    return (
        <li>
            <div className={`${isIncoming ? 'incoming' : 'author'}`}>
                <span><p>{message}</p></span>
                <span><p><Moment local fromNow>{time}</Moment></p></span>

            </div>
        </li>
    );
}

export default ChatMessage;

// <span className={`${isIncoming ? 'incoming' : 'author'}`}>
{/* <p>{message}</p> */}
    // <p><span>{time}</span></p>
            // </span >