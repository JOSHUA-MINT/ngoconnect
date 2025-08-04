const socket = io();

const fullName = sessionStorage.getItem('fullName');
const userType = sessionStorage.getItem('userType');

if (!fullName || !userType) {
  alert("You must be logged in to use the chat.");
  window.location.href = "login.html";
}

socket.emit('user_info', { fullName, userType });

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const myLabel = `${fullName} (${userType})`;

function addMessage(sender, text) {
  const div = document.createElement('div');
  div.className = "message " + (sender === myLabel ? "message-sent" : "message-received");
  div.innerHTML = `<div class="sender-label">${sender}</div><div>${text}</div>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (text) {
    socket.emit('chat_message', text);
    messageInput.value = '';
  }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

socket.on('chat_message', (data) => {
  addMessage(data.sender, data.text);
});
