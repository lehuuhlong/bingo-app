import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://bingo-app-server-052t.onrender.com');

export default function Bingo() {
  const [board, setBoard] = useState([]);
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
      // setCalledNumbers((prev) => [...prev, number]);
      setCalledNumbers(calledNumbers);
    });

    socket.on('chatMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('updateUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('resetNumber', () => {
      setCalledNumbers(['🌟']);
      setBingoName([]);
      if (!alert('Trò chơi đã được làm mới. Vui lòng F5 page')) {
        window.location.reload();
      }
    });

    socket.on('isBingo', (username) => {
      alert('Đã có người trúng Bingo');
      setBingoName(username);
    });

    socket.on('userBoard', (userBoard) => {
      setBoard(userBoard);
    });

    return () => {
      socket.off('numberCalled');
      socket.off('chatMessage');
      socket.off('updateUsers');
      socket.off('isBingo');
      socket.off('resetNumber');
    };
  }, []);

  useEffect(() => {
    checkBingo();
  }, [calledNumbers]);

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

  if (!isUsernameSet) {
    return (
      <div className="container text-center mt-5">
        <h2>Vui lòng nhập tên của bạn</h2>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Vui lòng nhập tên của bạn"
          value={username}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              setIsUsernameSet(true);
            }
          }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setIsUsernameSet(true)}>
          Xác nhận
        </button>
      </div>
    );
  }

  return (
    <>
      {bingoName && bingoName.length > 0 && (
        <div className="container text-center mt-5">
          <h2 className="text-secondary">🎉 Danh sách lụm Bingo 🎉</h2>
          <ul className="list-unstyled mb-3">
            {bingoName.map((user, index) => (
              <li className="alert alert-success mt-3" key={index}>
                {user}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="container text-center mt-5 d-flex justify-content-around">
        <div>
          <h1 className="mb-4 text-primary">Bingo Game</h1>
          {username === 'Admin Bingo' && (
            <>
              <button className="btn btn-primary mb-3 mr-2" onClick={() => socket.emit('callNumber')}>
                Gọi số
              </button>
              <button className="btn btn-primary mb-3" onClick={() => socket.emit('resetNumber')}>
                Reset
              </button>
            </>
          )}
          <div className="d-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {board.flat().length &&
              board.flat().map((num, index) => (
                <div
                  key={index}
                  className={`border p-4 rounded-circle text-lg fw-bold text-center d-flex align-items-center justify-content-center transition ${
                    calledNumbers.includes(num) ? 'bg-success text-white' : 'bg-light hover:bg-warning text-dark'
                  }`}
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
                >
                  {num}
                </div>
              ))}
          </div>
          {isBingo && <div className="alert alert-success mt-3">🎉 Bingo! Bạn đã thắng! 🎉</div>}
        </div>
        <div>
          <h2 className="text-secondary">Chat</h2>
          <div ref={chatRef} className="chat-box border rounded p-2 mb-2" style={{ height: '250px', width: '300px', overflowY: 'auto' }}>
            {chat.map((msg, index) => (
              <div key={index} className="text-left p-1 border-bottom">
                <strong style={{ color: `${username === 'Admin Bingo' ? 'red' : 'black'}` }}>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nhập tin nhắn"
            value={message}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Gửi
          </button>
        </div>
        <div style={{ width: '150px' }}>
          <h5 className="text-secondary">Người đang online</h5>
          <ul className="list-unstyled mb-3">
            {onlineUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container text-center mt-5">
        <h2 className="text-secondary">Số đã quay thưởng</h2>
        <div className="d-flex flex-wrap gap-2">
          {calledNumbers.map(
            (number, index) =>
              number !== '🌟' && (
                <div key={index} className="number-bingo border p-2 rounded text-white">
                  {number}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
