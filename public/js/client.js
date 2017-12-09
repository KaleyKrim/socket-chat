var socket = io.connect("http://localhost:8080/");

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');

var username;

form.addEventListener('submit', function(event){
  event.preventDefault();
  var text = document.forms[0][0].value;
  if(!username){
    username = text;
    socket.emit('name declaration', text);
    document.forms[0][0].value='';
  }else{
    socket.emit('chat message', username + ': ' + text);
    document.forms[0][0].value='';
  }
});

socket.on('chat message', function(msg){
  var newMessage = document.createElement('li');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
});

socket.on('admin', function(comment){
  var question = document.createElement('li');
  question.className = 'admin';
  question.innerHTML = comment;
  messages.appendChild(question);
});