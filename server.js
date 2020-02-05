const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const PORT = 900;

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});
// io.use((socket, next)=>{
//     // console.log('inside USE: ', socket);
//     next();
// });
const users = [];
io.on('connection', (socket) => {
    // console.log(socket, 'connected..');
    socket.on('set user', (name) => {
        const userData = {name, id: socket.id}
        const exists = users.find((user) => user.name === name)
        if (exists) {
            socket.emit('set user error');
            return;
        }
        users.push(userData)
        socket.emit('my_data', userData);
    });
    socket.on('chat message', (incomingUser, message) => {
        console.log('received user name: ', incomingUser);
        console.log('received chat message: ', message);
        const userObj = users.find((currentUser) => currentUser.name != incomingUser)
        socket.broadcast.to(userObj.id).emit('chat message', incomingUser, message);
    })
    socket.on('reconnection_data', (userName)=> {
        users.forEach((user, index) => {
            if (user.name == userName) {
                users[index].id = socket.id;
                socket.emit('user_id_update_success', users[index])
            }
        })
    });

});

server.listen(PORT, ()=> console.log(`Server lsitening on port ${PORT}`));
