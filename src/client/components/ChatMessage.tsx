import React, { FC, Fragment } from 'react';
import Moment from 'react-moment';

interface PropType {
    message: string
    time: string
    isIncoming: boolean
}

const ChatMessage: FC<PropType> = ({ message, time, isIncoming }) => {

    return (
        <Fragment>
            <li className={`chat-message-wrapper ${isIncoming ? 'incoming' : 'author'}`}>
                <div className={`chat-message-holder ${isIncoming ? 'incoming-color' : 'author-color'}`}>
                    <div className="chat-message"><span><p>{message}</p></span></div>
                    <span><p className="chat-time-holder"><Moment local fromNow>{time}</Moment></p></span>
                </div>
            </li>
        </Fragment>
    );
}

export default ChatMessage;

// <span className={`${isIncoming ? 'incoming' : 'author'}`}>
{/* <p>{message}</p> */}
    // <p><span>{time}</span></p>
            // </span >