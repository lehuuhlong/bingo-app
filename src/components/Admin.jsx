import React, { useContext, useEffect, useRef, useState } from 'react';
import AddPoint from './AddPoint';
import { refundPoint, minusPoint, takeAttendance, postCloseBingo, postBingoPoint } from '../services/userService';
import socket from '../services/socket';
import { chatMessage } from '../services/chatMessage';
import { CallNumbersContext } from '../context/CallNumbersContext';
import { CloseBingoContext } from '../context/CloseBingoContext';

const Admin = (props) => {
  const { onlineUsers, bingoName, usersBoard } = props;
  const { calledNumbers } = useContext(CallNumbersContext);
  const { nearlyBingoName } = useContext(CloseBingoContext);
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const [isTakeAttendance, setIsTakeAttendance] = useState(false);
  const [isTicketBingo, setIsTicketBingo] = useState(false);
  const [isRefundPoint, setIsRefundPoint] = useState(false);
  const [isSaveData, setIsSaveData] = useState(false);
  const [usersAttendance, setUsersAttendance] = useState([]);
  const autoCallInterval = useRef(null);

  useEffect(() => {
    if (!bingoName.length) return;
    stopAutoCall();
  }, [bingoName]);

  const startAutoCall = () => {
    if (bingoName.length) return;
    let message = calledNumbers.length === 0 ? 'Game Start! 🔥🔥🔥' : '🚀 Game Continues... 🚀';
    chatMessage('admin', 'Admin Bingo', message, 'admin');
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

    let message = '⚠️ Game Stop!';
    chatMessage('admin', 'Admin Bingo', message, 'admin');
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

    let pointReceive = onlineUsers.length * 20 * 0.95 - (onlineUsers.length - 1) * 2;
    let message = `Điểm danh thành công với ${onlineUsers.length} users. Có thể thắng: ${pointReceive} Point`;
    chatMessage('admin', 'Admin Bingo', message, 'admin');

    setIsTakeAttendance(true);

    socket.emit('takeAttendance', onlineUsers.length);

    setUsersAttendance(onlineUsers);
    await takeAttendance(onlineUsers);
  };

  const handleSaveData = async () => {
    if (bingoName.length === 0) {
      alert('No user is bingo');
      return;
    }
    setIsSaveData(true);

    // Set user have close bingo to DB
    await postCloseBingo(nearlyBingoName);

    // Set user have bingo to DB
    let pointReceive = (usersAttendance.length * 20 * 0.95 - (usersAttendance.length - 1) * 2) / bingoName.length;
    await postBingoPoint(bingoName, Math.floor(pointReceive));
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
        <button className="btn btn-info" onClick={handleTicketPoint} disabled={isTicketBingo || !isTakeAttendance}>
          Ticket point
        </button>
        <button className="btn btn-success" onClick={handleRefundPoint} disabled={isRefundPoint || !isTakeAttendance || bingoName.length === 0}>
          Refund point
        </button>
        <button className="btn btn-success" onClick={handleSaveData} disabled={isSaveData || bingoName.length === 0}>
          Save data
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
