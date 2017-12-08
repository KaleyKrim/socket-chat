var socket = io.connect("http://localhost:8080/");

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');

form.addEventListener('submit', function(event){
  event.preventDefault();
  var text = document.forms[0][0].value;
  socket.emit('chat message', text);
  document.forms[0][0].value='';
});

socket.on('chat message', function(msg){
  var newMessage = document.createElement('li');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
});