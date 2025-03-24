import React, { useContext, useEffect, useState } from 'react';
import socket from '../services/socket';
import ToastReset from '../toast/ToastReset';
import Board from './Board';
import { CallNumbersContext } from '../context/CallNumbersContext';
import { AuthContext } from '../context/AuthContext';

const TicketBingo = (props) => {
  const { bingoName, usersBoard } = props;
  const { user } = useContext(AuthContext);
  const { calledNumbers } = useContext(CallNumbersContext);
  const [isBingo, setIsBingo] = useState(false);
  const [show, setShow] = useState(false);
  const [bingoCells, setBingoCells] = useState([]);
  const [board, setBoard] = useState([]);
  const [nearlyBingoNumbers, setNearlyBingoNumbers] = useState([]);
  const [row, setRow] = useState([0, 1, 2, 3, 4]);

  useEffect(() => {
    socket.on('userBoard', (userBoard) => {
      setBoard(userBoard);
    });

    return () => {
      socket.off('userBoard');
    };
  }, []);

  useEffect(() => {
    for (let userId in usersBoard) {
      if (usersBoard[userId]?.username === user?.username) {
        setBoard(usersBoard[userId]?.board);
      }
    }
  }, [usersBoard]);

  useEffect(() => {
    if (isBingo) {
      socket.emit('isBingo', { username: user?.username, bingoCells });
    }
  }, [isBingo]);

  useEffect(() => {
    setTimeout(() => {
      findNearlyBingoNumbers();
      checkBingo();
    }, 750);
  }, [calledNumbers]);

  useEffect(() => {
    if (nearlyBingoNumbers.length === 0) return;
    socket.emit('nearlyBingo', { username: user?.username, nearlyBingoNumbers });
  }, [nearlyBingoNumbers]);

  const checkBingo = () => {
    if (!board.length) return;
    let newBingoCells = [];

    for (let i = 0; i < 5; i++) {
      if (board[i].every((num) => calledNumbers.includes(num))) {
        newBingoCells.push(...board[i]);
        setIsBingo(true);
      }

      const column = board.map((row) => row[i]);
      if (column.every((num) => calledNumbers.includes(num))) {
        newBingoCells.push(...column);
        setIsBingo(true);
      }
    }

    const diagonal1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    if (diagonal1.every((num) => calledNumbers.includes(num))) {
      newBingoCells.push(...diagonal1);
      setIsBingo(true);
    }

    const diagonal2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);
    if (diagonal2.every((num) => calledNumbers.includes(num))) {
      newBingoCells.push(...diagonal2);
      setIsBingo(true);
    }

    setBingoCells(newBingoCells);
  };

  const findNearlyBingoNumbers = () => {
    if (!board.length) return;
    let newNearlyBingoNumbers = [];

    for (let i = 0; i < 5; i++) {
      const row = board[i];
      const notCalledNumbers = row.filter((num) => !calledNumbers.includes(num));
      if (notCalledNumbers.length === 1) {
        newNearlyBingoNumbers.push(notCalledNumbers[0]);
      }

      const column = board.map((row) => row[i]);
      const notCalledInColumn = column.filter((num) => !calledNumbers.includes(num));
      if (notCalledInColumn.length === 1) {
        newNearlyBingoNumbers.push(notCalledInColumn[0]);
      }
    }

    const diagonal1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    const notCalledInDiagonal1 = diagonal1.filter((num) => !calledNumbers.includes(num));
    if (notCalledInDiagonal1.length === 1) {
      newNearlyBingoNumbers.push(notCalledInDiagonal1[0]);
    }

    const diagonal2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);
    const notCalledInDiagonal2 = diagonal2.filter((num) => !calledNumbers.includes(num));
    if (notCalledInDiagonal2.length === 1) {
      newNearlyBingoNumbers.push(notCalledInDiagonal2[0]);
    }

    // Remove duplicate numbers
    let newNearlyBingoNumbersSet = new Set([...newNearlyBingoNumbers]);
    newNearlyBingoNumbers = Array.from(newNearlyBingoNumbersSet);
    if (newNearlyBingoNumbers.toString() === nearlyBingoNumbers.toString()) return;

    setNearlyBingoNumbers(newNearlyBingoNumbers);
  };

  const handleResetBingo = () => {
    if (calledNumbers.length > 0 || usersBoard[user?.username]?.countReset === 0) return;
    setShow(true);

    // Call socket to reset bingo
    socket.emit('resetBingo', user?.username);

    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const handleResetBingoRow = (row) => {
    if (calledNumbers.length > 0 || usersBoard[user?.username]?.countResetRow[row] === 0) return;
    let name = user?.username;

    // Call socket to reset bingo
    socket.emit('resetBingoRow', { name, row });
  };

  return (
    <div className="text-center mb-4">
      <h4 className="text-secondary">🎲 Ticket Bingo 🎲</h4>
      <button
        className="btn btn-warning mb-2"
        onClick={handleResetBingo}
        disabled={calledNumbers.length > 0 || usersBoard[user?.username]?.countReset === 0}
      >
        Reset your bingo! (Remain: {usersBoard[user?.username]?.countReset})
      </button>
      <div>
        <h6 className="text-secondary">Reset row bingo</h6>
        {row.map((item) => (
          <button
            key={item}
            style={{ width: '40px', height: '40px' }}
            className="btn btn-info mb-2 mr-2 rounded-circle"
            onClick={() => handleResetBingoRow(item)}
            disabled={calledNumbers.length > 0 || usersBoard[user?.username]?.countResetRow[item] === 0}
          >
            {item + 1}
          </button>
        ))}
      </div>
      {isBingo && <div className="alert alert-success text-center">🎉 Bingo! 🎉</div>}
      <div className="bg-gradient-light p-3 rounded shadow">
        <Board bingoName={bingoName} bingoCells={bingoCells} board={board} />
        {board.length === 0 && (
          <h5>
            Opps!!! You're late! <br /> Please wait the next lucky-draw
          </h5>
        )}
      </div>

      <ToastReset isDisplay={show} countResetBingo={usersBoard[user?.username]?.countReset} />
    </div>
  );
};

export default TicketBingo;
