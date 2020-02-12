import React from 'react';
import ReactDom from 'react-dom';

import { App } from './screens';

import { SocketService } from './services/socketService';
import { SocketContext } from './context/socketContext';

import './styles/styles.css'
const port = process.env.PORT || 900;
const socketContext = new SocketService().init(port);

ReactDom.render(
    <SocketContext.Provider value={socketContext}>
        <App />
    </SocketContext.Provider>,
    document.getElementById('disposable')
);
