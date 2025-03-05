import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const socket = io(process.env.REACT_APP_SERVER_URL);

const Chat = (props) => {
  const { nickname, user } = props;
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
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

    return () => {
      socket.off('chatMessage');
      socket.off('chats');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim().length) {
      socket.emit('chatMessage', { nickname, message });
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-secondary text-center">💬Chat</h4>
      <h5 className="text-info text-center">
        {nickname} - <span className="text-danger">Point: {user?.point} </span>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip>
              <span>
                1 Point = 1.000đ <br /> 20 Point = 1 Ticket Bingo
              </span>
            </Tooltip>
          }
        >
          <span style={{ cursor: 'pointer' }}>📌</span>
        </OverlayTrigger>
      </h5>
      <div ref={chatRef} className="chat-box border rounded p-3 bg-light shadow-sm" style={{ height: '325px', overflowY: 'auto' }}>
        {chat.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong style={{ color: `${msg.nickname === 'Admin Bingo' ? 'red' : 'black'}` }}>{msg.nickname}:</strong> {msg.message}
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
      <button className="btn btn-secondary mt-2 w-100" onClick={sendMessage} disabled={message.trim().length === 0}>
        Send
      </button>
    </div>
  );
};

export default Chat;
