import React, { FC, useState, useEffect, useContext } from 'react';

import { Button, ChatMessage, Header, Input, FriendRequests } from './';
import Helper from '../utils/helper';
import { LocalStorageKeys } from '../../constants';
import { SocketContext } from '../context/socketContext';

interface PropType {
    chatId?: string
    friendRequests?: any
    selectedChat: any
}

const ChatPane: FC<PropType> = ({ chatId, friendRequests, selectedChat }) => {

    const [messages, setMessages] = useState([]);
    const [outgoingMessage, setOutgoingMessage] = useState('');
    const [friend, setFriend] = useState(null);

    const context = useContext(SocketContext);

    const { fetchLocalStorageItem } = Helper;
    const { FRIEND_LIST, USER_DATA } = LocalStorageKeys;

    const isEmpty = Helper.isEmptyOrNull(outgoingMessage);

    const sendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log('got clicked..')
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
        setMessages(selectedChat);
        selectCurrentFriend();
    }, [selectedChat]);


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
                        <FriendRequests newFriendRequests={friendRequests}/>
                    </div>
                </div>
                <div className="chat-view-header-child-bottom">
                    <span>{friend && friend.userName}</span>
                </div>
            </Header>
            <div className="chat-pane-messages-holder">
                <ul className="chat-pane-messages">
                    {/* <li> <span className="incoming">Here we display chat</span> </li> */}
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
