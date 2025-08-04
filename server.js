const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// LOGIN endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid email or password.' });

    res.json({
      message: `Welcome back, ${user.fullName}!`,
      userType: user.userType,
      fullName: user.fullName
    });
  });
});

// LIVE CHAT logic
io.on('connection', (socket) => {
  socket.on('user_info', ({ fullName, userType }) => {
    socket.userInfo = { fullName, userType };
  });

  socket.on('chat_message', (msg) => {
    const senderInfo = socket.userInfo || { fullName: 'Anonymous', userType: 'guest' };
    io.emit('chat_message', {
      sender: `${senderInfo.fullName} (${senderInfo.userType})`,
      text: msg,
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
