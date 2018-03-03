var socket = io.connect("192.168.0.2:8080/");

//"192.168.0.9:8080/"

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var val = document.getElementById('m');
var number = document.getElementById('users');
var receive = document.getElementById('receive');

var webcam = document.getElementById('webcam');
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

var username;
var users = [];
var userCount;

form.addEventListener('submit', function(event){
  event.preventDefault();
  if(!username){
    var name = document.forms[0][0].value;
    socket.emit('add user', name);
    document.forms[0][0].value='';
  }else{
    var text = document.forms[0][0].value;
    socket.emit('chat message', username + ': ' + text);
    document.forms[0][0].value='';
  }
});

socket.on('set name', function(name){
  username = name;
});

socket.on('login', function(userData){
  users.push(userData.username);
  userCount = userData.userCount;
  console.log(users);
});

socket.on('logout', function(userData){
  users.splice(users.indexOf(userData.username), 1);
  userCount = userData.userCount;
});

socket.on('chat message', function(message){
  postMessage(message, 'user-msg');
  updateScroll();
});

socket.on('admin', function(message){
  postMessage(message, 'admin');
});

socket.on('stream', function(data) {
  var receivedVideo = document.createElement('video');
  receivedVideo.className = 'received-video';
  receivedVideo.src = data;
  webcam.appendChild(receivedVideo);
});

navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
  var video = document.getElementById('selfie-cam');
  video.src = window.URL.createObjectURL(localMediaStream);
  socket.emit('stream', window.URL.createObjectURL(localMediaStream));

}, errorCallback);