const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json('hello');
})

io.on('connection', (socket) => {
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