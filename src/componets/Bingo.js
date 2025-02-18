import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://bingo-app-server-052t.onrender.com');

export default function Bingo() {
  const [board, setBoard] = useState([]);
  const [usersBoard, setUsersBoard] = useState({});
  const [calledNumbers, setCalledNumbers] = useState(['🌟']);
  const [isBingo, setIsBingo] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [bingoName, setBingoName] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (isUsernameSet) {
      if (username === 'admin123456') {
        setUsername('Admin Bingo');
      }
      socket.emit('setUsername', username === 'admin123456' ? 'Admin Bingo' : username);
    }
  }, [isUsernameSet]);

  useEffect(() => {
    socket.on('numberCalled', (calledNumbers) => {
      setCalledNumbers(calledNumbers);
    });

    socket.on('chatMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('updateUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('resetNumber', (usersBoard) => {
      alert('Trò chơi đã được làm mới!!!');
      setUsersBoard(usersBoard);
      setCalledNumbers(['🌟']);
      setBingoName([]);
    });

    socket.on('isBingo', (username) => {
      alert('Đã có người trúng Bingo');
      setBingoName(username);
    });

    socket.on('userBoard', (userBoard) => {
      setBoard(userBoard);
    });

    socket.on('bingoNames', (bingoNames) => {
      setBingoName(bingoNames);
    });

    return () => {
      socket.off('numberCalled');
      socket.off('chatMessage');
      socket.off('updateUsers');
      socket.off('isBingo');
      socket.off('bingoNames');
      socket.off('userBoard');
      socket.off('resetNumber');
    };
  }, []);

  useEffect(() => {
    checkBingo();
  }, [calledNumbers]);

  useEffect(() => {
    for (let userId in usersBoard) {
      if (usersBoard[userId]?.username === username) {
        setBoard(usersBoard[userId]?.board);
      }
    }
    console.log('username', username);
  }, [usersBoard]);

  useEffect(() => {
    if (isBingo) {
      socket.emit('isBingo', username);
    }
  }, [isBingo]);

  function checkBingo() {
    if (board.length) {
      for (let i = 0; i < 5; i++) {
        if (board[i].every((num) => num === '🌟' || calledNumbers.includes(num))) {
          setIsBingo(true);
          return;
        }
        if (board.map((row) => row[i]).every((num) => num === '🌟' || calledNumbers.includes(num))) {
          setIsBingo(true);
          return;
        }
      }
      if (
        [0, 1, 2, 3, 4].every((i) => board[i][i] === '🌟' || calledNumbers.includes(board[i][i])) ||
        [0, 1, 2, 3, 4].every((i) => board[i][4 - i] === '🌟' || calledNumbers.includes(board[i][4 - i]))
      ) {
        setIsBingo(true);
        return;
      }
    }
    setIsBingo(false);
  }

  function sendMessage() {
    if (message) {
      socket.emit('chatMessage', { username, message });
      setMessage('');
    }
  }

  function scrollToBottom() {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }

  function handleConfirm() {
    if (username) {
      setIsUsernameSet(true)
    }

    return;
  }

  if (!isUsernameSet) {
    return (
      <div className="container text-center mt-5">
        <h2>Please enter your account</h2>
        <input
          type="text"
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
    <div className="container mt-5">
      <div className="row mb-4 text-center d-block">
        <h2 className="text-success fw-bold">Bingo Game</h2>
      </div>

      <div className="row">
        {bingoName && bingoName.length > 0 && (
          <div className="col-lg-12 text-center">
            <h4 className="text-secondary">🎉 List users Bingo! Congratulation! 🎉</h4>
            <ul className="list-unstyled">
              {bingoName.map((user, index) => (
                <li className="alert alert-success mt-2 shadow-sm rounded" key={index}>
                  {user}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="col-lg-8">
          <div className="mb-4 text-center">
            <h4 className="text-secondary">🎲 Lottery number 🎲</h4>
            <div className="d-flex flex-wrap gap-2 justify-content-center bg-light p-3 rounded shadow">
              {calledNumbers.map(
                (number, index) =>
                  number !== '🌟' && (
                    <div
                      key={index}
                      className="mr-1 mb-1 rounded-circle bg-info text-white d-flex align-items-center justify-content-center number-ball"
                      style={{
                        width: '50px',
                        height: '50px',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        animation: 'spin 1s ease-in-out',
                      }}
                    >
                      {number}
                    </div>
                  )
              )}
            </div>
          </div>
          <div className="text-center mb-4">
            <h4 className="text-secondary">🎲 Ticket Bingo 🎲</h4>
            <div className="bg-gradient-light p-3 rounded shadow">
              <div className="d-grid " style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', display: 'inline-grid' }}>
                {board.flat().map((num, index) => (
                  <div
                    key={index}
                    className={`border p-3 rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm ${
                      calledNumbers.includes(num) ? 'bg-success text-white' : 'bg-light text-dark'
                    }`}
                    style={{ width: '60px', height: '60px', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {isBingo && <div className="alert alert-success mt-4 text-center">🎉 Bingo! Congratulation! 🎉</div>}

          {username === 'Admin Bingo' && (
            <div className="mt-4 d-flex justify-content-between">
              <button className="btn btn-danger" onClick={() => socket.emit('callNumber')}>
                Gọi số
              </button>
              <button className="btn btn-warning" onClick={() => socket.emit('resetNumber')}>
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="mb-4">
            <h4 className="text-secondary text-center">💬 Chat</h4>
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

          <div>
            <h5 className="text-secondary text-center">👥 Members online</h5>
            <ul className="list-unstyled">
              {onlineUsers.map((user, index) => (
                <li key={index} className="alert alert-info p-2 rounded shadow-sm">
                  {user}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
