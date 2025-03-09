import React, { useState } from 'react';
import { postRegister } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await postRegister({ username, password });
      setMessage('Registration successful! Redirect...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Account" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Registration</button>
      </form>
    </div>
  );
};

export default Register;
