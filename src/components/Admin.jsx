import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import AddUsersPoint from './AddUsersPoint';
import AddUsersPointBingo from './AddUsersPointBingo';
import { refundPoint, minusPoint } from '../services/userService';
import UserTable from './UserTable';

const socket = io(process.env.REACT_APP_SERVER_URL);

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
    if (bingoName.length) return;
    clearInterval(autoCallInterval.current);
    setIsAutoCalling(false);
    let nickname = 'Admin Bingo';
    let message = 'Game stop!';
    socket.emit('chatMessage', { nickname, message });
  };

  const handleRefundAndMinusPoint = async () => {
    let usersRefund = onlineUsers.filter((user) => !bingoName.includes(user));
    let usersMinus = onlineUsers.filter((user) => usersBoard[user].point >= 20);

    await refundPoint(usersRefund);
    if (usersMinus.length) {
      await minusPoint(usersMinus);
    }
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
        <button className="btn btn-warning" onClick={handleRefundAndMinusPoint}>
          Refund and Minus point
        </button>
      </div>
      <AddUsersPoint />
      <AddUsersPointBingo />
      <UserTable />
    </>
  );
};

export default Admin;
