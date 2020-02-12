import React, { useEffect, useContext } from 'react';

import { Home, Auth } from '.'
import { Container } from '../components';
import { SocketContext } from '../context/socketContext';

import { UserEvents, LocalStorageKeys } from '../../constants';

const App = () => {
    const context = useContext(SocketContext);
    useEffect(() => {
        const reconnectObservable = context.onReconnect();
        reconnectObservable.subscribe(() => {
            const userData = localStorage.getItem(LocalStorageKeys.USER_DATA)
            context.send(UserEvents.USER_RECONNECT_DATA, { userData: JSON.parse(userData) });
        })
    }, []);
    return (
        <Container>
            <Auth />
        </Container>
    )
}

export default App;
