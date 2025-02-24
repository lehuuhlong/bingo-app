import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import ModalBingoName from '../modal/ModalBingoName';
import ModalReset from '../modal/ModalReset';
import ToastReset from '../toast/ToastReset';
import MemberOnline from './MemberOnline';
import AddUsersPoint from './AddUsersPoint';
import Dashboard from './Dashboard';

const socket = io(process.env.REACT_APP_SERVER_URL);

export default function Bingo() {
  const [board, setBoard] = useState([]);
  const [usersBoard, setUsersBoard] = useState({});
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [isBingo, setIsBingo] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [bingoName, setBingoName] = useState([]);
  const [currentSpinningNumber, setCurrentSpinningNumber] = useState('🌟');
  const [isAutoCalling, setIsAutoCalling] = useState(false);
  const autoCallInterval = useRef(null);
  const [bingoCells, setBingoCells] = useState([]);
  const [countResetBingo, setCountResetBingo] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const [nearlyBingoNumbers, setNearlyBingoNumbers] = useState([]);
  const [nearlyBingoName, setNearlyBingoName] = useState([]);

  const chatRef = useRef(null);
  const buttonBingoRef = useRef(null);
  const buttonResetRef = useRef(null);

  useEffect(() => {
    if (isUsernameSet) {
      if (username === 'admin') {
        setUsername('Admin Bingo');
      }
      socket.emit('setUsername', username === 'admin' ? 'Admin Bingo' : username);
    }
  }, [isUsernameSet]);

  useEffect(() => {
    socket.on('numberCalled', (newCalledNumbers) => {
      if (newCalledNumbers?.length === 0) return;
      const latestNumber = newCalledNumbers[newCalledNumbers.length - 1];

      let randomInterval = setInterval(() => {
        setCurrentSpinningNumber(Math.floor(Math.random() * 75) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(randomInterval);
        setCurrentSpinningNumber(latestNumber);
        setCalledNumbers(newCalledNumbers);
      }, 2500);
    });

    socket.on('chats', (chats) => {
      setTimeout(() => {
        scrollToBottom();
      }, 700);
      setChat(chats);
    });

    socket.on('chatMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('updateUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('resetNumber', (usersBoard) => {
      // buttonResetRef.current.click();
      setUsersBoard(usersBoard);
      setCalledNumbers([]);
      setCurrentSpinningNumber('🌟');
      setBingoName([]);
      setIsBingo(false);
      setCountResetBingo(0);
      setNearlyBingoName([]);
      setNearlyBingoNumbers([]);
      window.location.reload();
    });

    socket.on('isBingo', (username) => {
      buttonBingoRef.current.click();
      setBingoName(username);
    });

    socket.on('userBoard', (userBoard) => {
      setBoard(userBoard);
    });

    socket.on('usersBoard', (usersBoard) => {
      setUsersBoard(usersBoard);
    });

    socket.on('bingoNames', (bingoNames) => {
      setBingoName(bingoNames);
    });

    socket.on('nearlyBingo', (number) => {
      setNearlyBingoName(number);
    });

    return () => {
      socket.off('numberCalled');
      socket.off('chatMessage');
      socket.off('updateUsers');
      socket.off('isBingo');
      socket.off('bingoNames');
      socket.off('userBoard');
      socket.off('resetNumber');
      socket.off('chats');
      socket.off('nearlyBingo');
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      checkBingo();
      findNearlyBingoNumbers();
    }, 750);
  }, [calledNumbers]);

  useEffect(() => {
    for (let userId in usersBoard) {
      if (usersBoard[userId]?.username === username) {
        setBoard(usersBoard[userId]?.board);
      }
    }
  }, [usersBoard]);

  useEffect(() => {
    if (isBingo) {
      socket.emit('isBingo', { username, bingoCells });
    }
  }, [isBingo]);

  useEffect(() => {
    if (!bingoName.length) return;
    stopAutoCall();
  }, [bingoName]);

  useEffect(() => {
    if (!nearlyBingoNumbers.length) return;
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

  const sendMessage = () => {
    if (message) {
      socket.emit('chatMessage', { username, message });
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleConfirm = () => {
    if (username) {
      setIsUsernameSet(true);
    }

    return;
  };

  const handleResetBingo = () => {
    if (!username || countResetBingo === 2 || bingoName.length > 0 || calledNumbers.length > 0) return;
    setIsDisplay(true);
    setCountResetBingo(countResetBingo + 1);
    socket.emit('resetBingo', username);
    setTimeout(() => {
      setIsDisplay(false);
    }, 3000);
  };

  const startAutoCall = () => {
    let username = 'Admin Bingo';
    let message = 'Game start!';
    socket.emit('chatMessage', { username, message });
    if (!isAutoCalling) {
      setIsAutoCalling(true);

      autoCallInterval.current = setInterval(() => {
        if (bingoName.length === 0) {
          socket.emit('callNumber');
        } else {
          stopAutoCall();
        }
      }, 5000);
    }
  };

  const stopAutoCall = () => {
    clearInterval(autoCallInterval.current);
    setIsAutoCalling(false);
  };

  const numberBingCells = (num) => {
    let isNumber = false;
    for (let name of bingoName) {
      isNumber = usersBoard[name]?.bingoCells.includes(num);
      if (isNumber) break;
    }

    return isNumber;
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        if (!newNearlyBingoNumbers.includes(notCalledInColumn[0])) {
          newNearlyBingoNumbers.push(notCalledInColumn[0]);
        }
      }
    }

    const diagonal1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    const notCalledInDiagonal1 = diagonal1.filter((num) => !calledNumbers.includes(num));
    if (notCalledInDiagonal1.length === 1) {
      if (!newNearlyBingoNumbers.includes(notCalledInDiagonal1[0])) {
        newNearlyBingoNumbers.push(notCalledInDiagonal1[0]);
      }
    }

    const diagonal2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);
    const notCalledInDiagonal2 = diagonal2.filter((num) => !calledNumbers.includes(num));
    if (notCalledInDiagonal2.length === 1) {
      if (!newNearlyBingoNumbers.includes(notCalledInDiagonal2[0])) {
        newNearlyBingoNumbers.push(notCalledInDiagonal2[0]);
      }
    }

    if (newNearlyBingoNumbers.toString() === nearlyBingoNumbers.toString()) return;

    setNearlyBingoNumbers(newNearlyBingoNumbers);
  };

  if (!isUsernameSet) {
    return (
      <div className="container text-center mt-5">
        <h2>Please enter your account</h2>
        <input
          type="text"
          maxLength="15"
          className="form-control mb-2"
          placeholder="Please enter your account"
          value={username}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              setIsUsernameSet(true);
            }
          }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    );
  }

  return (
    <div className="container-90 mt-1">
      <div className="row mb-2 text-center d-block">
        <img style={{ height: '150px' }} src="logo-bingo.jpg" alt="logo" />
      </div>

      <div className="row">
        <div className="col-lg-2">
          <div className="text-center">
            <img className="jackpot" src="jackpot.png" alt="jackpot" />
            <h5 className="text-center text-danger">{numberWithCommas(onlineUsers.length * 20000)}đ</h5>
          </div>
          <div className="member-online-hide">
            <MemberOnline onlineUsers={onlineUsers} username={username} />
          </div>
        </div>
        <div className="col-lg-7">
          {bingoName && bingoName.length > 0 && (
            <div className="text-center mb-4">
              <h4 className="text-secondary">🎉 List users Bingo! 🎉</h4>
              <div className="bg-gradient-light p-3 rounded shadow">
                <div className="row">
                  {bingoName.map((name, index) => (
                    <div className={bingoName.length > 1 ? 'col-lg-6' : 'col'} key={index}>
                      <h6 className="text-warning mt-2">Winner: {name} 🎉</h6>
                      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', display: 'inline-grid' }}>
                        {usersBoard[name]?.board.flat().map((num, index) => (
                          <div
                            key={index}
                            className={`border p-3 rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm ${
                              bingoName.length > 0
                                ? usersBoard[name]?.bingoCells.includes(num)
                                  ? 'bg-success text-white'
                                  : calledNumbers.includes(num)
                                  ? 'bg-secondary text-white'
                                  : 'bg-light text-dark'
                                : calledNumbers.includes(num)
                                ? 'bg-success text-white'
                                : 'bg-light text-dark'
                            }`}
                            style={{ width: '50px', height: '50px', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.3s' }}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {username === 'Admin Bingo' && (
            <>
              <div className="mt-4 d-flex justify-content-between">
                <button className="btn btn-danger" onClick={startAutoCall} disabled={isAutoCalling}>
                  {isAutoCalling ? 'Đang gọi số...' : 'Gọi số'}
                </button>
                <button className="btn btn-danger" onClick={stopAutoCall} disabled={!isAutoCalling}>
                  Stop
                </button>
                <button className="btn btn-danger" onClick={() => socket.emit('testBingo')}>
                  Test Bingo
                </button>
                <button className="btn btn-warning" onClick={() => socket.emit('resetNumber')}>
                  Reset
                </button>
              </div>
              <AddUsersPoint />
            </>
          )}
          <div className="mb-4 text-center">
            <h4 className="text-secondary">🎲 Lottery number 🎲</h4>
            <div className="d-flex flex-wrap gap-2 justify-content-center bg-light p-3 rounded shadow">
              {calledNumbers.map(
                (number, index) =>
                  number !== '🌟' && (
                    <div
                      key={index}
                      className={`mr-1 mb-1 rounded-circle d-flex align-items-center justify-content-center number-ball ${
                        bingoName.length > 0 ? (numberBingCells(number) ? 'bg-success text-white' : 'bg-secondary text-white') : 'bg-info text-white'
                      }`}
                      style={{
                        width: '50px',
                        height: '50px',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        animation: 'scaleIn 1s ease-in-out',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          animation: 'spin 1s ease-in-out',
                        }}
                      >
                        {number}
                      </p>
                    </div>
                  )
              )}
              {currentSpinningNumber && bingoName.length === 0 && (
                <div
                  className="number-ball"
                  style={{
                    width: '50px',
                    height: '50px',
                    fontSize: '1.2rem',
                    borderRadius: '50%',
                    backgroundColor: '#ffc107',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'spin 1s linear infinite',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {currentSpinningNumber}
                </div>
              )}
            </div>
          </div>
          <div className="text-center mb-4">
            <h4 className="text-secondary">🎲 Ticket Bingo 🎲</h4>
            <button
              className="btn btn-warning mb-2"
              onClick={handleResetBingo}
              disabled={countResetBingo === 2 || bingoName.length > 0 || calledNumbers.length > 0}
            >
              Reset your bingo! (Remain: {2 - countResetBingo})
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
          </div>
        </div>

        <div className="col-lg-3">
          {nearlyBingoName.length > 0 && (
            <div className="mt-4">
              <h5 className="text-warning">⚠️ Users with numbers close to Bingo: {nearlyBingoName.length}</h5>
              <ul className="alert alert-warning shadow-sm rounded p-2">
                <AnimatePresence>
                  {nearlyBingoName
                    .sort((a, b) => usersBoard[b]?.nearlyBingos.length - usersBoard[a]?.nearlyBingos.length)
                    .map((name) => (
                      <motion.li
                        key={name}
                        className="ml-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }} className="mb-1">
                          <strong className="mr-2 mb-1">{name}:</strong>
                          {usersBoard[name]?.nearlyBingos.map((number) => (
                            <motion.div
                              key={number}
                              className={`mr-1 mb-1 rounded-circle d-flex align-items-center justify-content-center number-ball ${
                                bingoName.length > 0
                                  ? numberBingCells(number)
                                    ? 'bg-success text-white'
                                    : 'bg-warning text-dark'
                                  : 'bg-warning text-dark'
                              }`}
                              style={{
                                width: '35px',
                                height: '35px',
                                fontSize: '0.8rem',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p style={{ margin: 0 }}>{number}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.li>
                    ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
          <div className="mb-4">
            <h4 className="text-secondary text-center">
              💬 Chat(<span className="text-info">{username}</span>)
            </h4>
            <div ref={chatRef} className="chat-box border rounded p-3 bg-light shadow-sm" style={{ height: '250px', overflowY: 'auto' }}>
              {chat.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong style={{ color: `${msg.username === 'Admin Bingo' ? 'red' : 'black'}` }}>{msg.username}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Enter message"
              value={message}
              maxLength="80"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  sendMessage();
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-secondary mt-2 w-100" onClick={sendMessage}>
              Send
            </button>
          </div>
          <Dashboard />
          <div className="member-online-show">
            <MemberOnline onlineUsers={onlineUsers} username={username} />
          </div>
        </div>
      </div>

      <ModalBingoName bingoName={bingoName} />
      <ModalReset />
      <ToastReset isDisplay={isDisplay} countResetBingo={countResetBingo} />

      <button
        ref={buttonBingoRef}
        style={{ display: 'none' }}
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#bingoModal"
      ></button>

      <button
        ref={buttonResetRef}
        style={{ display: 'none' }}
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#resetModal"
      ></button>
    </div>
  );
}
