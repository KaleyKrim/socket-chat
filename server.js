const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const path = require('path');
const users = {};


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json('hello');
})

io.on('connection', (socket) => {

  users[socket.id] = null;
  io.emit('users', users);
  socket.emit('admin', `Oh, hey there. What's your name?`);

  socket.on('name declaration', (name)=> {

    var vals = Object.keys(users).map(function(key) {
      return users[key];
    });

    if(vals.indexOf(name.toLowerCase()) >= 0){
      socket.emit('admin', `You can't be ${name}, the REAL ${name} is already here chatting. Who are you REALLY?`);
    }else{
      users[socket.id] = name.toLowerCase();
      socket.emit('setName', name);
      io.emit('admin', `Hello, ${name} ;) ❤︎`);
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  console.log('user connected!!');
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users', users);
    console.log('user disconnected');
  });
})

http.listen(port, () => {
  console.log(`Server listening on ${port}`)
});