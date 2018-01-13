const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const path = require('path');
const users = {};

var userCount = 0;


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  userCount++;
  users[socket.id] = null;
  io.emit('users', users);
  socket.emit('admin', `Oh, hey there. What's your name?`);

  socket.on('add user', (name)=> {

    let currentUsers = Object.keys(users).map(function(key) {
      return users[key];
    });

    if(currentUsers.indexOf(name.toLowerCase()) >= 0){
      socket.emit('admin', `You can't be ${name}, the REAL ${name} is already here chatting. Who are you REALLY?`);
    }else{
      socket.username = name.toLowerCase();
      users[socket.id] = name.toLowerCase();
      socket.emit('set name', name);
      io.emit('login', {
        userCount : userCount,
        username: socket.username
      });
      // io.emit('admin', `Hello, ${name} ;) ❤︎`);
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  console.log('user connected!!');

  socket.on('stream', (video) => {
    io.emit('stream', video);
  })

  socket.on('disconnect', () => {
    userCount--;
    delete users[socket.id];
    io.emit('logout', {
      username: socket.username,
      userCount : userCount
    });
    console.log('user disconnected');
  });
})

http.listen(port, () => {
  console.log(`Server listening on ${port}`)
});