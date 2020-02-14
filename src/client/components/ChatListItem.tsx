import React, { FC } from 'react';
import { Link, withRouter } from 'react-router-dom';
interface PropType {
    userName: string,
    match: any,
}

const ChatListItem: FC<PropType> = ({ userName, match  }) => {

    return (
        <li className="chat-list-item">
            <Link to={`${match.url}/pane`}>
                <p>{userName}</p>
            </Link>
        </li>
    );
 };

export default ChatListItem;
