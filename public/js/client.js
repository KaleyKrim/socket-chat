var socket = io.connect("localhost:8080/");

//"192.168.0.9:8080/"

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');
var number = document.getElementById('users');
var receive = document.getElementById('receive');

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

var receivedVideo = document.getElementById('receivedVideo');

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

socket.on('stream', function(data) {
  console.log(data);
  receivedVideo.src = data;
});

function onStream(stream) {
  receivedVideo.src = URL.createObjectURL(stream);
  receivedVideo.addEventListener('error', function() {
    stream.stop();
  });
}

var errorCallback = function(e) {
  console.log('Error!', e);
};

navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(localMediaStream);
  socket.emit('stream', window.URL.createObjectURL(localMediaStream));

  video.onloadedmetadata = function(e) {

  };
}, errorCallback);