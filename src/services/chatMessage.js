import socket from './socket';

export const chatMessage = (username, nickname, message, role) => {
  socket.emit('chatMessage', { username, nickname, message, role });
};
