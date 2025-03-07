import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import ToastReset from '../toast/ToastReset';

const TicketBingo = (props) => {
  const { bingoName, calledNumbers, usersBoard, username, board } = props;
  const [isBingo, setIsBingo] = useState(false);
  const [show, setShow] = useState(false);
  const [bingoCells, setBingoCells] = useState([]);
  const [nearlyBingoNumbers, setNearlyBingoNumbers] = useState([]);

  useEffect(() => {
    if (isBingo) {
      socket.emit('isBingo', { username, bingoCells });
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
    socket.emit('nearlyBingo', { username, nearlyBingoNumbers });
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
    if (calledNumbers.length > 0 || usersBoard[username]?.countReset === 0) return;
    setShow(true);

    // Call socket to reset bingo
    socket.emit('resetBingo', username);

    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  return (
    <div className="text-center mb-4">
      <h4 className="text-secondary">🎲 Ticket Bingo 🎲</h4>
      <button
        className="btn btn-warning mb-2"
        onClick={handleResetBingo}
        disabled={calledNumbers.length > 0 || usersBoard[username]?.countReset === 0}
      >
        Reset your bingo! (Remain: {usersBoard[username]?.countReset})
      </button>
      {isBingo && <div className="alert alert-success text-center">🎉 Bingo! 🎉</div>}
      <div className="bg-gradient-light p-3 rounded shadow">
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', display: 'inline-grid' }}>
          {board.flat().map((num, index) => (
            <div
              key={index}
              className={`border p-3 rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm ${
                bingoName.length > 0
                  ? bingoCells.includes(num)
                    ? 'bg-success text-white'
                    : calledNumbers.includes(num)
                    ? 'bg-secondary text-white'
                    : 'bg-light text-dark'
                  : calledNumbers.includes(num)
                  ? 'bg-success text-white'
                  : 'bg-light text-dark'
              }`}
              style={{ width: '60px', height: '60px', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {num}
            </div>
          ))}
        </div>
        {board.length === 0 && (
          <h5>
            Opps!!! You're late! <br /> Please wait the next lucky-draw
          </h5>
        )}
      </div>

      <ToastReset isDisplay={show} countResetBingo={usersBoard[username]?.countReset} />
    </div>
  );
};

export default TicketBingo;
