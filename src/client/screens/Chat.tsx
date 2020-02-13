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

    return (
        <Fragment>
            <h1>Chat Screen</h1>
            <Route component={ChatList} />
            <Media query={Helper.routeMediaQueries.mobile}>
                { mobile => !mobile && <Route component={ChatPane} /> }
            </Media>
        </Fragment>
    );
 };

export default Chat;
