const messages = document.getElementById('messages');
let chatElement = document.getElementById("chat");

function displayMessage(message, className) {
  let newMessage = document.createElement('li');
  newMessage.className = className;
  newMessage.innerHTML = message;
  messages.appendChild(newMessage);
}

function updateScroll(){
  chatElement.scrollTop = chatElement.scrollHeight;
}