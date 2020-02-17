import React, { useContext, useEffect } from 'react';

import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import { Chat, Home } from '.'
import { Container } from '../components';
import { SocketContext } from '../context/socketContext';

import { ClientRoutes, LocalStorageKeys, UserEvents } from '../../constants';
import Helper from '../utils/helper';

const App = () => {
    const context = useContext(SocketContext);
    const history = useHistory();
    const location = useLocation();

    const reConnectionHandler = () => {
        const userData = Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA);
        userData && context.send(UserEvents.USER_RECONNECT_DATA, userData);
        !userData && location.pathname !== ClientRoutes.HOME && history.push(ClientRoutes.HOME);
    };

    const handleUnAuthorizedUser = () => {
        Helper.removeLocalStorageItem(LocalStorageKeys.USER_DATA);
        history.push(ClientRoutes.HOME);
     };

    useEffect(() => {
        /**
         * Implement client-side reconnection strategy.
         * This sends user credentials to the server on every reconnect to:
         *  1. Make sure we have update socket.id for each connected user as it changes on reconnect.
         *      we will be storing the socket.id against userName (userName: [socket.id]) in redis
         *  2. [optional]: validate user credentials and possibly prompt user to Authenticate
         *      if token if expired or do nothing if no token was sent.
         */
        // const reconnectObservable = context.onReconnect();
        const onUserUnAuthorized = context.onUserUnAuthorized();
        const userSocketSyncErrorObservable = context.onUserSocketSyncError();
        const userSocketSyncSuccessObservable = context.onUserSocketSyncSuccess();


        const onConnection = context.onConnection();
        onConnection.subscribe(reConnectionHandler);

        // reconnectObservable.subscribe(reConnectionHandler);
        onUserUnAuthorized.subscribe(handleUnAuthorizedUser);
        userSocketSyncErrorObservable.subscribe(() => {
            localStorage.removeItem(LocalStorageKeys.USER_DATA);
            history.push(ClientRoutes.HOME);
        });
        userSocketSyncSuccessObservable.subscribe((data) => {
            console.log('current data on sync success: ', data);
        });
    }, []);

    return (
        <Container>
            <Switch>
                <Route exact path={`${ClientRoutes.HOME}`} component={Home} />
                <Route path={`${ClientRoutes.CHAT}`} component={Chat} />
            </Switch>
        </Container>
    )
}

export default App;
