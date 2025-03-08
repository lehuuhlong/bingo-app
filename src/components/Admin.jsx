import React, { useEffect, useRef, useState } from 'react';
import AddPoint from './AddPoint';
import { refundPoint, minusPoint, takeAttendance } from '../services/userService';
import socket from '../services/socket';
import moment from 'moment';

const Admin = (props) => {
  const { onlineUsers, bingoName, usersBoard, calledNumbers } = props;
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const [isTakeAttendance, setIsTakeAttendance] = useState(false);
  const [isTicketBingo, setIsTicketBingo] = useState(false);
  const [isRefundPoint, setIsRefundPoint] = useState(false);
  const [usersAttendance, setUsersAttendance] = useState([]);
  const autoCallInterval = useRef(null);

  useEffect(() => {
    if (!bingoName.length) return;
    stopAutoCall();
  }, [bingoName]);

  const startAutoCall = () => {
    if (bingoName.length) return;

    let username = 'Admin Bingo';
    let message = calledNumbers.length === 0 ? 'Game Start! 🔥🔥🔥' : '🚀 Game Continues... 🚀';
    socket.emit('chatMessage', { username, nickname: username, message, time: moment().format('HH:mm'), role: 'admin' });
    if (!isAutoCalling) {
      setIsAutoCalling(true);

      autoCallInterval.current = setInterval(() => {
        if (bingoName.length === 0) {
          socket.emit('callNumber');
        } else {
          stopAutoCall();
        }
      }, 13000);
    }
  };

  const stopAutoCall = () => {
    clearInterval(autoCallInterval.current);
    setIsAutoCalling(false);
    if (bingoName.length) return;

    let username = 'Admin Bingo';
    let message = '⚠️ Game Stop!';
    socket.emit('chatMessage', { username, nickname: username, message, time: moment().format('HH:mm'), role: 'admin' });
  };

  // Refund point
  const handleRefundPoint = async () => {
    let usersRefund = usersAttendance.filter((user) => !bingoName.includes(user));
    if (usersRefund.length === 0) {
      alert('No user has a bingo to refund');
      return;
    }
    setIsRefundPoint(true);
    await refundPoint(usersRefund);
  };

  // Ticket point
  const handleTicketPoint = async () => {
    let usersMinus = usersAttendance.filter((user) => usersBoard[user].point >= 20);
    if (usersMinus.length === 0) {
      alert('No user has enough points to buy a ticket');
      return;
    }
    await minusPoint(usersMinus);
    setIsTicketBingo(true);
  };

  // Take attendance
  const handleTakeAttendance = async () => {
    if (onlineUsers.length === 0) {
      alert('No user is online to take attendance');
      return;
    }
    setIsTakeAttendance(true);

    socket.emit('takeAttendance', onlineUsers.length);

    setUsersAttendance(onlineUsers);
    await takeAttendance(onlineUsers);
  };

  return (
    <div className="card shadow bg-light p-2">
      <h4 className="text-secondary text-center">⚙️Control Center</h4>
      <div className="mt-4 d-flex justify-content-between p-3">
        <button className="btn btn-danger" onClick={startAutoCall} disabled={isAutoCalling}>
          {isAutoCalling && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          {isAutoCalling ? ' Calling number...' : calledNumbers.length === 0 ? 'Call number' : 'Continue'}
        </button>
        <button className="btn btn-danger" onClick={stopAutoCall} disabled={!isAutoCalling}>
          Stop
        </button>
        <button className="btn btn-info" onClick={handleTakeAttendance} disabled={isTakeAttendance}>
          Take Attendance
        </button>
        <button className="btn btn-info" onClick={handleTicketPoint} disabled={isTicketBingo}>
          Ticket point
        </button>
        <button className="btn btn-success" onClick={handleRefundPoint} disabled={isRefundPoint}>
          Refund point
        </button>
        <button className="btn btn-warning" onClick={() => socket.emit('resetNumber')}>
          Restart game
        </button>
      </div>
      <AddPoint />
    </div>
  );
};

export default Admin;
