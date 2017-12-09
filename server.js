const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const path = require('path');
const users = [];


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json('hello');
})

io.on('connection', (socket) => {
  socket.emit('username request', `Oh, hey there. What's your name?`);

  socket.on('name declaration', (name)=> {
    users.push(name);
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  console.log('user connected!!');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

http.listen(port, () => {
  console.log(`Server listening on ${port}`)
});