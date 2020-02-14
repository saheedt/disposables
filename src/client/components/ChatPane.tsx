import React, { FC, useState, useEffect } from 'react';

import { Input, Button, ChatMessage } from '../components';

interface PropType {
    incomingMessage: any
    messageHistory: any
}

const ChatPane: FC<PropType> = ({ incomingMessage, messageHistory }) => {

    const [messages, setMessages] = useState([]);

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
                <form className="chat-pane-input-form" onSubmit={()=>{}}>
                    <Input
                        label="Chat input"
                        placeholder="Type a message"

                    />
                    <Button text="send" />
                </form>
            </div>
        </section>
    );
};

export default ChatPane;
