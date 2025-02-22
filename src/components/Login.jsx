import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/bingo');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
