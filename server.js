const app = require('express')();
const http = require('http').Server(app);
const port = process.env.port || 8080;
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
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