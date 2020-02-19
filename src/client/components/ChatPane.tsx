import React, { FC, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button, ChatMessage, Header, Input, FriendRequests } from './';
import Helper from '../utils/helper';
import { ChatEvents, LocalStorageKeys } from '../../constants';
import { SocketContext } from '../context/socketContext';

interface PropType {
    chatId?: string
    friendRequests?: any
    incoming?: any
    selectedChat: any
}

const ChatPane: FC<PropType> = ({ chatId, friendRequests, incoming, selectedChat }) => {

    const [messages, setMessages] = useState([]);
    const [outgoingMessage, setOutgoingMessage] = useState('');
    const [friend, setFriend] = useState(null);
    const [clearInput, setClearInput] = useState('');

    const context = useContext(SocketContext);

    const { OUTGOING_IM } = ChatEvents;
    const { addToMessageRepo, clone, fetchLocalStorageItem, isEmptyOrNull, timeStamp } = Helper;
    const { FRIEND_LIST, USER_DATA, IMS } = LocalStorageKeys;

    const isEmpty = isEmptyOrNull(outgoingMessage);

    const scrollToLast = (config: any) => {
        const items = document.getElementsByClassName('chat-message-holder');
        if (items && items.length <= 0) {
            return;
        }
        const last = items[items.length - 1];
        last.scrollIntoView(config);
    };

    const sendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const user = fetchLocalStorageItem(USER_DATA);
        const outgoing = {
            message: outgoingMessage,
            from: user.data._id,
            to: friend._id,
            id: uuidv4(),
            timestamp: timeStamp()
        };
        const msgClone = clone(messages);
        msgClone.push(outgoing);
        setMessages(msgClone);
        addToMessageRepo(outgoing, chatId, IMS);
        context.send(OUTGOING_IM, {
            user,
            chat: outgoing
        });
        setTimeout(() => scrollToLast({ behavior: "smooth", block: "end" }), 0);
        setClearInput(uuidv4());
    };

    const selectCurrentFriend = () => {
        const user = fetchLocalStorageItem(USER_DATA);
        const friendsList = fetchLocalStorageItem(FRIEND_LIST);
        if (chatId) {
            const friendId = chatId.split('<>').find((item) => item !== user.data._id);
            const currentFriend = friendsList.find((item: any) => item._id === friendId);
            setFriend(currentFriend);
        }
    };

    useEffect(() => {
        console.log('chatpane selectedChat: ', selectedChat)
        setMessages(selectedChat);
        selectCurrentFriend();
        setTimeout(() => scrollToLast({ block: "end" }), 0);
    }, [selectedChat]);

    useEffect(() => {
        if (messages && incoming) {
            console.log('selected: ', selectedChat);
            const friendsList = fetchLocalStorageItem(FRIEND_LIST);
            const currentFriend = friendsList.find((item: any) => item._id === incoming.from);
            setFriend(currentFriend);
            const msgClone = clone(messages);
            msgClone.push(incoming);
            setMessages(msgClone);
            setTimeout(() => scrollToLast({ behavior: "smooth", block: "end" }), 0);
        }

    }, [incoming]);


    const renderChatMessages = () => {
        return messages.map((item, index) => (
            <ChatMessage
                key={`msg__${index}__msg`}
                message={item.message}
                time={item.timestamp}
                isIncoming={friend._id === item.from}
            />
        ));
    };

    return (
        <section className="chat-pane-container">
            <Header styleClass="chat-pane-header">
                <div className="chat-view-header-child-top chat-pane-header-child-top">
                    <div className="chat-pane-friend-rqst-bell">
                        <FriendRequests newFriendRequests={friendRequests}/>
                    </div>
                </div>
                <div className="chat-view-header-child-bottom">
                    <span>{friend && friend.userName}</span>
                </div>
            </Header>
            <div className="chat-pane-messages-holder">
                <ul id="messages" className="chat-pane-messages">
                    {/* <li> <span className="incoming">Here we display chat</span> </li> */}
                    {(messages && messages.length > 0) ?
                        [...renderChatMessages()]
                        :
                        <li className="chat-pane-default-message">
                            <span className="">Le beginning 😁</span>
                        </li>
                    }
                </ul>
            </div>
            <div className="chat-pane-input-holder">
                <form className="chat-pane-input-form" onSubmit={sendMessage}>
                    <Input
                        clear={clearInput}
                        label="Chat input"
                        placeholder="Type a message"
                        extractValue={setOutgoingMessage}
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
