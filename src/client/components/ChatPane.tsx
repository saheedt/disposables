import React, { FC, useState, useEffect } from 'react';

import { Button, ChatMessage, Header, Input, FriendRequests } from './';
import Helper from '../utils/helper';

interface PropType {
    incomingMessage: any
    messageHistory: any
    friendRequests?: any
}

const ChatPane: FC<PropType> = ({ incomingMessage, messageHistory, friendRequests }) => {

    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    const isEmpty = Helper.isEmptyOrNull(currentMessage);

    const sendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log('got clicked..')

    };

    useEffect(() => {
        setMessages(messageHistory)
    }, []);
    useEffect(() => {

    }, [incomingMessage]);


    const renderChatMessages = () => {
        return messages.map((item, index) => (
            <ChatMessage
                key={`msg__${index}__msg`}
                message={item.message}
                time={item.time}
            />
        ));
    };

    return (
        <section className="chat-pane-container">
            <Header styleClass="chat-pane-header">
                <div className="chat-view-header-child-top chat-pane-header-child-top">
                    <div className="chat-pane-friend-rqst-bell">
                        <FriendRequests friendRequests={friendRequests}/>
                    </div>
                </div>
                <div className="chat-view-header-child-bottom">
                </div>
            </Header>
            <div className="chat-pane-messages-holder">
                <ul className="chat-pane-messages">
                    <li> <span className="incoming">Here we display chat</span> </li>
                    {(messages && messages.length > 0) ?
                        {...renderChatMessages()}
                        :
                        <li className="chat-pane-default-message">
                            <span className="author">Le beginning 😁</span>
                        </li>
                    }
                </ul>
            </div>
            <div className="chat-pane-input-holder">
                <form className="chat-pane-input-form" onSubmit={sendMessage}>
                    <Input
                        label="Chat input"
                        placeholder="Type a message"
                        extractValue={setCurrentMessage}
                    />
                    <Button disabled={isEmpty}>
                        send
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default ChatPane;
