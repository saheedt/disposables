import React, { FC, useState, useEffect } from 'react';

import { ChatListItem } from './';

interface PropType {
    friendList: any[],
    match: any
}
const ChatList: FC<PropType> = ({ friendList, match }) => {
    const [list, setList] = useState([]);

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
