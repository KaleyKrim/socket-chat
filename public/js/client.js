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
    socket.emit('name declaration', text);
    document.forms[0][0].value='';
  }else{
    socket.emit('chat message', username + ': ' + text);
    document.forms[0][0].value='';
  }
});

socket.on('setName', function(name){
  username = name;
})

socket.on('users', function(users){
  users = users;
  if (Object.keys(users).length > 1){
    number.innerHTML =  'There are currently ' + Object.keys(users).length.toString() + ' people chatting.';
  }else{
    number.innerHTML = 'You are the only one here. Sry ;(';
  }
})

socket.on('chat message', function(message){
  postMessage(message, 'user-msg');
  updateScroll();
});

socket.on('admin', function(message){
  postMessage(message, 'admin');
});