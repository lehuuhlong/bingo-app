const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://bingo-app-8c71.onrender.com',
    methods: ['GET', 'POST'],
  },
});
app.use(cors());

let users = {};
let usersBoard = {};
let calledNumbers = ['🌟'];
let bingoNames = [];
let chats = [];
let isBingo = false;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('setUsername', (username) => {
    if (username !== 'Admin Bingo') {
      let userBoard = [];
      for (let userId in usersBoard) {
        if (usersBoard[userId].username === username) {
          userBoard = usersBoard[userId].board;
          break;
        }
      }
      if (!userBoard.length && !(calledNumbers.length > 5)) {
        userBoard = generateBoard();
      }

      usersBoard[username] = { username, board: userBoard };
      socket.emit('userBoard', userBoard);
      users[socket.id] = username;
    }

    io.emit('updateUsers', Object.values(users));
    io.emit('numberCalled', calledNumbers);
    io.emit('bingoNames', bingoNames);
    io.emit('chats', chats);
  });

  socket.on('callNumber', () => {
    if (calledNumbers.length >= 75 || bingoNames.length > 0 || isBingo) return;
    let number;
    do {
      number = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(number));
    calledNumbers.push(number);
    io.emit('numberCalled', calledNumbers);
  });

  socket.on('resetNumber', () => {
    calledNumbers = ['🌟'];
    bingoNames = [];
    isBingo = false;
    for (let userId in usersBoard) {
      usersBoard[userId].board = generateBoard();
    }
    sendMessageAuto('Admin Bingo', 'Game Over! Go to the next game');
    io.emit('resetNumber', usersBoard);
  });

  socket.on('isBingo', (username) => {
    if (checkBingo(usersBoard[username]?.board, calledNumbers) && !bingoNames.includes(username)) {
      bingoNames.push(username);
      io.emit('isBingo', bingoNames);
      isBingo = true;
      sendMessageAuto('Admin Bingo', 'Bingo: ' + username + ' 🎉');
    }
  });

  socket.on('chatMessage', ({ username, message }) => {
    chats.push({ username, message });
    io.emit('chatMessage', { username, message });
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
  board[2][2] = '🌟';
  return board;
}

function checkBingo(board, calledNumbers) {
  if (board?.length) {
    for (let i = 0; i < 5; i++) {
      if (board[i].every((num) => num === '🌟' || calledNumbers.includes(num))) {
        return true;
      }
      if (board.map((row) => row[i]).every((num) => num === '🌟' || calledNumbers.includes(num))) {
        return true;
      }
    }
    if (
      [0, 1, 2, 3, 4].every((i) => board[i][i] === '🌟' || calledNumbers.includes(board[i][i])) ||
      [0, 1, 2, 3, 4].every((i) => board[i][4 - i] === '🌟' || calledNumbers.includes(board[i][4 - i]))
    ) {
      return true;
    }
  }
  return false;
}

function sendMessageAuto(username, message) {
  chats.push({ username, message });
  io.emit('chatMessage', { username, message });
}

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
