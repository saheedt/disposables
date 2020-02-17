import React from 'react';
import ReactDom from 'react-dom';

import { BrowserRouter } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {  faBell as farBell } from '@fortawesome/free-regular-svg-icons';

import { App } from './screens';

import { SocketService } from './services/socketService';
import { SocketContext } from './context/socketContext';

import './styles/styles.css';

const port = process.env.PORT || 900;
const socketContext = new SocketService().init(port);

library.add(faUserPlus, faBell, farBell);

ReactDom.render(
    <BrowserRouter>
        <SocketContext.Provider value={socketContext}>
            <App />
        </SocketContext.Provider>
    </BrowserRouter>
    ,
    document.getElementById('disposable')
);
