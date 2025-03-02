require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');

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

app.use('/api/user', userRoutes);

let users = {};
let usersBoard = {};
let calledNumbers = [];
let bingoNames = [];
let chats = [];
let isBingo = false;
let usersNearlyBingo = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('setUsername', async ({ username, nickname }) => {
    if (username !== 'Admin Bingo') {
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

  socket.on('callNumber', () => {
    if (isBingo || calledNumbers.length >= 75 || bingoNames.length > 0) return;
    let number;
    do {
      number = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(number));
    calledNumbers.push(number);
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
    sendMessageAuto('Admin Bingo', 'Game Over! Go to the next game');
    io.emit('resetNumber', usersBoard);
  });

  socket.on('isBingo', ({ username, bingoCells }) => {
    if (checkBingo(usersBoard[username]?.board, calledNumbers) && !bingoNames.includes(username)) {
      isBingo = true;
      bingoNames.push(username);
      usersBoard[username].bingoCells = bingoCells;
      io.emit('isBingo', bingoNames);
      io.emit('usersBoard', usersBoard);
      sendMessageAuto('Admin Bingo', 'Bingo: ' + username + ' 🎉');
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

  socket.on('chatMessage', ({ nickname, message }) => {
    chats.push({ nickname, message });
    io.emit('chatMessage', { nickname, message });
  });

  socket.on('nearlyBingo', ({ username, nearlyBingoNumbers }) => {
    if ((!username && !nearlyBingoNumbers) || isBingo || !usersBoard[username]) return;
    if (!usersNearlyBingo.includes(username)) {
      usersNearlyBingo.push(username);
    }
    usersBoard[username] = { ...usersBoard[username], nearlyBingos: nearlyBingoNumbers };
    sendMessageAuto('Admin Bingo', 'User: ' + username + ' có số gần trúng Bingo: ' + nearlyBingoNumbers);
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

function sendMessageAuto(username, message) {
  chats.push({ username, message });
  io.emit('chatMessage', { username, message });
}

async function addUser(username) {
  try {
    let existingUser = await User.findOne({ username });
    let point = 0;
    if (!existingUser) {
      const newUser = new User({ username });
      await newUser.save();
    }

    return existingUser ? existingUser.point : point;
  } catch (error) {
    console.error('Add user error:', error);
  }
}

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
