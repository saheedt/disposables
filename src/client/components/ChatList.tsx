import React, { FC, useState, useEffect } from 'react';

import { Button, ChatListItem, Header, SearchModal } from './';

interface PropType {
    friendList: any[],
    match: any
}
const ChatList: FC<PropType> = ({ friendList, match }) => {
    const [list, setList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                userName={item.userName}
                match={match}
            />
        ));
    };

    return (
        <section className="chat-list-container">
            <Header styleClass="chat-list-header">
                <div className="chat-list-header-child-top"></div>
                <div className="chat-list-header-child-bottom">
                    <Button handleClick={handleAddUserModalToggle} text="add" />
                    <SearchModal isOpen={isModalOpen} toggleModal={handleAddUserModalToggle}/>
                </div>
            </Header>
            <ul className="chat-list">
                <li className="chat-list-item" >Here we list all..</li>
                {list && list.length > 0 ?
                    RenderList()
                    :
                    null
                }
            </ul>
        </section>
    );
 }

export default ChatList;
