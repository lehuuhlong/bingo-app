import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import AddUsersPoint from './AddUsersPoint';
import AddUsersPointBingo from './AddUsersPointBingo';
import { refundPoint } from '../services/userService';
import TransactionTable from './TransactionTable';

const socket = io(process.env.REACT_APP_SERVER_URL);

const Admin = (props) => {
  const { onlineUsers, bingoName } = props;
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const autoCallInterval = useRef(null);

  useEffect(() => {
    if (!bingoName.length) return;
    stopAutoCall();
  }, [bingoName]);

  const startAutoCall = () => {
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
    let nickname = 'Admin Bingo';
    let message = 'Game stop!';
    socket.emit('chatMessage', { nickname, message });
  };

  const handleRefundPoint = async () => {
    await refundPoint(onlineUsers);
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
        <button className="btn btn-warning" onClick={handleRefundPoint}>
          Refund point
        </button>
      </div>
      <AddUsersPoint />
      <AddUsersPointBingo />
      <TransactionTable />
    </>
  );
};

export default Admin;
