import socket from './socket';
import moment from 'moment-timezone';

export const chatMessage = (username, nickname, message, role) => {
  let time = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm');
  socket.emit('chatMessage', { username, nickname, message, time: time, role });
};
