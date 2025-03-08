import React, { useEffect, useRef, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import socket from '../services/socket';
import moment from 'moment';

const Chat = (props) => {
  const { nickname, username, user } = props;
  const [message, setMessage] = useState('');
  const [minTicket, setMinTicket] = useState(0);
  const [maxTicket, setMaxTicket] = useState(1);
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    if (user?.point) {
      setMinTicket(Math.floor(user.point / 20));
      setMaxTicket(Math.floor(user.point / 20) + 1);
    }
  }, [user]);

  useEffect(() => {
    socket.on('chats', (chats) => {
      setChat(chats);
    });

    socket.on('chatMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chatMessage');
      socket.off('chats');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim().length) {
      let time = moment().format('HH:mm');
      socket.emit('chatMessage', { username, nickname, message, time, role: user?.role });
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleDisplayColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-danger';
      case 'moderator':
        return 'text-info';
      case 'user':
        return 'text-dark';
      default:
        return 'text-dark';
    }
  };

  const calculateProgressBar = () => {
    if (!user?.point) return 0;
    if (user?.point <= minTicket * 20) return 0;
    return ((user.point - minTicket * 20) / 20) * 100;
  };

  return (
    <div className="mb-4">
      <h4 className="text-secondary text-center">💬Chat</h4>
      <h5 className="text-info text-center">
        {nickname} -{' '}
        <span className="text-danger">
          Point: {user?.point ? user.point : <Spinner style={{ height: '1.25rem', width: '1.25rem' }} animation="border" variant="danger" />}
        </span>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip id="point-tooltip">
              <span>20 Point = 1 Ticket Bingo</span>
            </Tooltip>
          }
        >
          <span style={{ cursor: 'pointer' }}> 📌</span>
        </OverlayTrigger>
      </h5>
      <div className="mb-3 d-flex justify-content-center" style={{ height: '0.5rem' }}>
        <strong>Have {minTicket}</strong>
        <ProgressBar style={{ height: '0.5rem', width: '50%', margin: '8px' }} striped animated variant="info" now={calculateProgressBar()} />
        <strong>{maxTicket} Ticket</strong>
      </div>
      <div ref={chatRef} className="chat-box border rounded p-3 bg-light shadow-sm" style={{ height: '325px', overflowY: 'auto' }}>
        {chat.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="text-secondary">{msg.time} </span>
            <OverlayTrigger
              placement="left"
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip id="chat-tooltip">
                  <span>{msg.username}</span>
                </Tooltip>
              }
            >
              <strong className={handleDisplayColor(msg.role)}>{msg.nickname}: </strong>
            </OverlayTrigger>
            {msg.message}
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
