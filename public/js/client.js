const socket = io.connect("http://localhost:8080/");

const form = document.getElementById('form');
const chatInput = document.getElementById('message-input');
const number = document.getElementById('users');

let username;

const users = {};

form.addEventListener('submit', function(event){
  event.preventDefault();
  const input = chatInput.value;

  if(!username) {
    socket.emit('registration', input);
    chatInput.value='';
    return;
  }

  socket.emit('chatMessage', `${username}: ${input}`);
  chatInput.value='';
});

socket.on('approveName', ((name) => {
  username = name;
}));

socket.on('users', ((users) => {
  users = users;

  const userNum = Object.keys(users).length;
  const userNumDisplay = `There ${userNum === 1 ? 'is' : 'are'} currently ${userNum} ${userNum === 1 ? 'person' : 'people'} chatting.`;
  number.innerHTML = userNumDisplay;
}));

socket.on('chatMessage', ((message) => {
  displayMessage(message, 'user-msg');
  updateScroll();
}));

socket.on('admin', ((message) => {
  displayMessage(message, 'admin');
}));