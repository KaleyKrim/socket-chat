var socket = io.connect("192.168.0.9:8080/");

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

 var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

var errorCallback = function(e) {
  console.log('Reeeejected!', e);
};

// Not showing vendor prefixes.
navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(localMediaStream);

  // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
  // See crbug.com/110938.
  video.onloadedmetadata = function(e) {
    // Ready to go. Do some stuff.
  };
}, errorCallback);

function snapshot() {
  if (localMediaStream) {
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
    ctx.drawImage(video, 0, 0, 267, 200);
    // "image/webp" works in Chrome.
    // Other browsers will fall back to image/png.
    document.querySelector('img').src = canvas.toDataURL('image/webp');
  }
}

video.addEventListener('click', snapshot, false);

// Not showing vendor prefixes or code that works cross-browser.
navigator.getUserMedia({video: true}, function(stream) {
  video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;
}, errorCallback);