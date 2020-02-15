import React, { useContext, useEffect } from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Chat, Home } from '.'
import { Container } from '../components';
import { SocketContext } from '../context/socketContext';

import { ClientRoutes, LocalStorageKeys, UserEvents } from '../../constants';

const App = () => {
    const context = useContext(SocketContext);

    useEffect(() => {
        /**
         * Implement client-side reconnection strategy.
         * This sends user credentials to the server on every reconnect to:
         *  1. Make sure we have update socket.id for each connected user as it changes on reconnect.
         *      we will be storing the socket.id against userName (userName: [socket.id]) in redis
         *  2. [optional]: validate user credentials and possibly prompt user to Authenticate
         *      if token if expired or do nothing if no token was sent.
         */

        const reconnectObservable = context.onReconnect();
        reconnectObservable.subscribe(() => {
            const userData = localStorage.getItem(LocalStorageKeys.USER_DATA)
            context.send(UserEvents.USER_RECONNECT_DATA, { userData: JSON.parse(userData) });
        })
    }, []);

    return (
        <BrowserRouter>
            <Container>
                <Switch>
                    <Route exact path={`${ClientRoutes.HOME}`} component={Home} />
                    <Route path={`${ClientRoutes.CHAT}`} component={Chat} />
                </Switch>
            </Container>
        </BrowserRouter>
    )
}

export default App;
