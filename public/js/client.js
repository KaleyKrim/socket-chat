var socket = io.connect("http://localhost:8080/");

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');

var number = document.getElementById('users');

var username;

var users = {};

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

socket.on('users', function(users){
  if (Object.keys(users).length > 1){
    number.innerHTML =  'There are currently ' + Object.keys(users).length.toString() + ' people chatting.';
  }else{
    number.innerHTML = 'There is currently ' + Object.keys(users).length.toString() + ' person chatting ;(';
  }
})

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