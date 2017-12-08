// $(function () {
//   var socket = io();
//   $('form').submit(function(){
//     socket.emit('chat message', $('#m').val());
//     $('#m').val('');
//     return false;
//   });
//   socket.on('chat message', function(msg){
//     $('#messages').append($('<li>').text(msg));
//   });
// });
var socket = io.connect("http://localhost:8080/");

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m').value;

form.addEventListener('submit', function(event){
  event.preventDefault();
  var text = document.forms[0][0].value;
  socket.emit('chat message', text);
});

socket.on('chat message', function(msg){
  var newMessage = document.createElement('li');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
});


// socket.emit('chat message', m.val());

// newMessage.innerHTML =
// messages.appendChild(newMessage);