import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/bingo');
    } catch (err) {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>

      <div className="form-group">
        <label htmlFor="account" className="font-weight-bold">
          Account
        </label>
        <input
          type="text"
          id="account"
          maxLength="11"
          className="form-control mb-2"
          placeholder="Ex: LongLHH1"
          value={username}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSubmit();
            }
          }}
          onChange={(e) => setUsername(e.target.value.trim())}
        />
        <small id="accountHelp" className="form-text text-danger">
          *** Please enter your account correctly to receive points. ***
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="nickname" className="font-weight-bold">
          Nickname in the game
        </label>
        <input
          type="text"
          maxLength="17"
          id="nickname"
          className="form-control mb-2"
          placeholder="Ex: Long Lém Lĩnh"
          value={nickname}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSubmit();
            }
          }}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      {username === 'Admin Bingo' && (
        <div className="form-group">
          <label htmlFor="password" className="font-weight-bold">
            Password
          </label>
          <input
            type="password"
            maxLength="17"
            id="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSubmit();
              }
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
};

export default Login;
