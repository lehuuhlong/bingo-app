import React, { useEffect, useRef, useState } from 'react';
import AddPoint from './AddPoint';
import AddPointGift from './AddPointGift';
import AddPointBingo from './AddPointBingo';
import { refundPoint, minusPoint } from '../services/userService';
import UserTable from './UserTable';
import socket from '../services/socket';

const Admin = (props) => {
  const { onlineUsers, bingoName, usersBoard } = props;
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const autoCallInterval = useRef(null);

  useEffect(() => {
    if (!bingoName.length) return;
    stopAutoCall();
  }, [bingoName]);

  const startAutoCall = () => {
    if (bingoName.length) return;

    let nickname = 'Admin Bingo';
    let message = 'Game start!';
    socket.emit('chatMessage', { nickname, message });
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
    let nickname = 'Admin Bingo';
    let message = 'Game stop!';
    socket.emit('chatMessage', { nickname, message });
  };

  const handleRefundPoint = async () => {
    let usersRefund = onlineUsers.filter((user) => !bingoName.includes(user));
    await refundPoint(usersRefund);
  };

  const handleTicketPoint = async () => {
    let usersMinus = onlineUsers.filter((user) => usersBoard[user].point >= 20);
    if (usersMinus.length === 0) {
      alert('No user has enough points to buy a ticket');
      return;
    }
    await minusPoint(usersMinus);
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-between">
        <button className="btn btn-danger" onClick={startAutoCall} disabled={isAutoCalling}>
          {isAutoCalling && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          {isAutoCalling ? ' Calling number...' : 'Call number'}
        </button>
        <button className="btn btn-danger" onClick={stopAutoCall} disabled={!isAutoCalling}>
          Stop
        </button>
        <button className="btn btn-warning" onClick={() => socket.emit('resetNumber')}>
          Reset
        </button>
        <button className="btn btn-warning" onClick={handleTicketPoint}>
          Ticket point
        </button>
        <button className="btn btn-warning" onClick={handleRefundPoint}>
          Refund point
        </button>
      </div>
      <AddPoint />
      <AddPointGift />
      <AddPointBingo />
      <UserTable />
    </>
  );
};

export default Admin;
