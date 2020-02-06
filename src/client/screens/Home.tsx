import React from 'react';
import io from 'socket.io-client';

io('localhost:900')
const Home = () => {
    return (<div> Welcome HOME!!!</div>);
};

export default Home;