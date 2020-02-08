import React from 'react';
import io from 'socket.io-client';

const socket = io('localhost:900');


socket.on('reconnect', (data: any) => {
    console.log('reconnection:::', data);
    socket.emit('handle_reconnection', { is: 'a connect..' });
});

socket.on('disconnect', (reason: any) => {
    console.log('disconnection reason: ', reason)
})

const Home = () => {
    return (<div> Welcome HOME!!!</div>);
};

export default Home;

socket.on('reconnect_attempt', () => {
    console.log('this happens before the reconnection itself...')
});