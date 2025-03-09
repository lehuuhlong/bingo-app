require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const saveBingoNumber = require('./service/saveBingoNumber');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
connectDB();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/statistics', statisticsRoutes);

// Socket.io
let users = {};
let usersBoard = {};
let calledNumbers = [];
let bingoNames = [];
let chats = [];
let isBingo = false;
let usersNearlyBingo = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('setUsername', async ({ username, nickname, role }) => {
    if (role === 'user') {
      let point = await addUser(username);
      let userBoard = [];
      let bingoCells = [];
      let nearlyBingos = [];
      let countReset = 3;
      for (let userId in usersBoard) {
        if (usersBoard[userId].username === username) {
          userBoard = usersBoard[userId].board;
          bingoCells = usersBoard[userId].bingoCells;
          nearlyBingos = usersBoard[userId].nearlyBingos;
          countReset = usersBoard[userId].countReset;
          break;
        }
      }
      if (!userBoard.length && !(calledNumbers.length > 2)) {
        userBoard = generateBoard();
      }

      usersBoard[username] = { username, board: userBoard, bingoCells, nearlyBingos, nickname, countReset, point };
      socket.emit('userBoard', userBoard);
      users[socket.id] = username;
    }

    io.emit('updateUsers', Object.values(users));
    io.emit('numberCalled', calledNumbers);
    io.emit('bingoNames', bingoNames);
    io.emit('chats', chats);
    io.emit('usersBoard', usersBoard);
    io.emit('nearlyBingo', usersNearlyBingo);
  });

  socket.on('callNumber', async () => {
    if (isBingo || calledNumbers.length >= 75 || bingoNames.length > 0) return;
    let number;
    do {
      number = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(number));
    calledNumbers.push(number);
    await saveBingoNumber(number);
    io.emit('numberCalled', calledNumbers);
  });

  socket.on('resetNumber', () => {
    calledNumbers = [];
    bingoNames = [];
    usersNearlyBingo = [];
    usersBoard = {};
    isBingo = false;
    for (let userId in usersBoard) {
      usersBoard[userId].board = generateBoard();
      usersBoard[userId].nearlyBingos = [];
    }
    sendMessageAuto('Admin Bingo', 'Admin Bingo', '✔️ Game Over! Go to the next game');
    io.emit('resetNumber', usersBoard);
  });

  socket.on('isBingo', ({ username, bingoCells }) => {
    if (checkBingo(usersBoard[username]?.board, calledNumbers) && !bingoNames.includes(username)) {
      isBingo = true;
      bingoNames.push(username);
      usersBoard[username].bingoCells = bingoCells;
      io.emit('isBingo', bingoNames);
      io.emit('usersBoard', usersBoard);
      sendMessageAuto('Admin Bingo', 'Admin Bingo', 'Bingo: ' + username + ' 🎉');
    }
  });

  socket.on('resetBingo', (name) => {
    let userBoard = [];
    let countReset = usersBoard[name]?.countReset;
    if (!name || bingoNames.length > 0 || calledNumbers.length > 0 || countReset === 0) return;
    userBoard = generateBoard();
    usersBoard[name] = { ...usersBoard[name], board: userBoard, countReset: countReset - 1 };
    socket.emit('userBoard', userBoard);
    io.emit('usersBoard', usersBoard);
  });

  socket.on('chatMessage', ({ username, nickname, message, time, role }) => {
    chats.push({ username, nickname, message, time, role });
    io.emit('chatMessage', { username, nickname, message, time, role });
  });

  socket.on('nearlyBingo', ({ username, nearlyBingoNumbers }) => {
    if ((!username && !nearlyBingoNumbers) || isBingo || !usersBoard[username]) return;
    if (!usersNearlyBingo.includes(username)) {
      usersNearlyBingo.push(username);
    }
    usersBoard[username] = { ...usersBoard[username], nearlyBingos: nearlyBingoNumbers };
    let message = '🎯 User: ' + usersBoard[username]?.nickname + ' có số gần trúng Bingo: ' + nearlyBingoNumbers;
    sendMessageAuto('Admin Bingo', 'Admin Bingo', message);
    io.emit('nearlyBingo', usersNearlyBingo);
    io.emit('usersBoard', usersBoard);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('updateUsers', Object.values(users));
  });
});

function generateBoard() {
  let board = [];
  let numbers = new Set();
  for (let i = 0; i < 5; i++) {
    let row = [];
    while (row.length < 5) {
      let num = Math.floor(Math.random() * 75) + 1;
      if (!numbers.has(num)) {
        numbers.add(num);
        row.push(num);
      }
    }
    board.push(row);
  }
  return board;
}

function checkBingo(board, calledNumbers) {
  if (board?.length) {
    for (let i = 0; i < 5; i++) {
      if (board[i].every((num) => calledNumbers.includes(num))) {
        return true;
      }
      if (board.map((row) => row[i]).every((num) => calledNumbers.includes(num))) {
        return true;
      }
    }
    if ([0, 1, 2, 3, 4].every((i) => calledNumbers.includes(board[i][i])) || [0, 1, 2, 3, 4].every((i) => calledNumbers.includes(board[i][4 - i]))) {
      return true;
    }
  }
  return false;
}

function sendMessageAuto(username, nickname, message) {
  let time = moment().format('HH:mm');
  chats.push({ username, nickname, message, time, role: 'admin' });
  io.emit('chatMessage', { username, nickname, message, time, role: 'admin' });
}

async function addUser(username) {
  try {
    let existingUser = await User.findOne({ username });
    return existingUser.point;
  } catch (error) {
    console.error('Add user error:', error);
  }
}

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
