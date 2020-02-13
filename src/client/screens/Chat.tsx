import React, { FC, Fragment, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Media from 'react-media';

import { ChatList, ChatPane } from '../components';

import { LocalStorageKeys } from '../../constants';
import Helper from '../utils/helper';

const Chat: FC<any> = ({ history }) => {

    useEffect(() => {
        const localUserData = localStorage.getItem(LocalStorageKeys.USER_DATA);
        !localUserData && history.push('/');
    }, []);
    const dummyFriendList = [
        { userName: 'aubama-bloodclot-yang' },
        { userName: 'Lacazette' },
        { userName: 'Hectizee' },
        { userName: 'M10Mesut' },
        { userName: 'kolasinac' },
    ];
    return (
        <section className="chat-container">
            <Route render={(props) => <ChatList friendList={dummyFriendList} {...props}/>} />
            <Media query={Helper.routeMediaQueries.mobile}>
                { mobile => !mobile && <Route component={ChatPane} /> }
            </Media>
        </section>
    );
 };

export default Chat;
