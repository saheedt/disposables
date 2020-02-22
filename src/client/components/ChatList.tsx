import React, { FC, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, ChatListItem, Header, SearchModal } from './';


interface PropType {
    friendList: any[],
    selectChat: any,
    selectedFriend: string,
    match: any
}
const ChatList: FC<PropType> = ({ friendList, selectChat, selectedFriend, match }) => {
    const emojis = ['😢', '😳', '🤯', '🤡', '😱', '🌚', '🌝', '😕']
    const [list, setList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const randomEmoji = (emojiset: string[]): string => {
        const index = Math.floor(Math.random() * emojiset.length)
        return emojiset[index];
    }


    const handleAddUserModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        setList(friendList);
    }, [friendList])



    const RenderList = () => {
        return list.map((item, index) => (
            <ChatListItem
                key={`${item.userName}__${index}`}
                friendId={item._id}
                userName={item.userName}
                selectChat={selectChat}
                isActive={item._id === selectedFriend}
                isFirst={index === 0}
                match={match}
            />
        ));
    };

    return (
        <section className="chat-list-container">
            <Header styleClass="chat-list-header">
                <div className="chat-view-header-child-top"></div>
                <div className="chat-view-header-child-bottom">
                    <Button handleClick={handleAddUserModalToggle}>
                        <FontAwesomeIcon className="user-add-font general-icon-font" icon="user-plus"/>
                    </Button>
                    <SearchModal isOpen={isModalOpen} toggleModal={handleAddUserModalToggle}/>
                </div>
            </Header>
            <ul className="chat-list">
                {list && list.length > 0 ?
                    RenderList()
                    :
                    <li className="chat-list-item" >{randomEmoji(emojis)} You have no friend(s) on your list</li>
                }
            </ul>
        </section>
    );
 }

export default ChatList;
