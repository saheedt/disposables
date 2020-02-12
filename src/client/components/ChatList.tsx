import React, { FC, useState, useEffect } from 'react';

import { ChatListItem } from './';

interface PropType {
    friendList: any[]
}
const ChatList: FC<PropType> = ({ friendList }) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        setList(friendList);
    }, [friendList])

    const RenderList = () => {
        return list.map((item, index) => (
            <ChatListItem key={`${item.userName}__${index}`} userName={item.userName} />
        ));
    };

    return (
        <ul>
            { ...RenderList() }

        </ul>
    );
 }

export default ChatList;
