import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const { login, loginGuess, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(user?.username || '');
    setNickname(user?.nickname || '');
  }, [user]);

  const handleSubmit = async () => {
    const u = username.trim();
    const n = nickname.trim();
    if (u.length < 3) {
      setMessage('Username must be at least 3 characters');
      return;
    }

    if (n.length < 1) {
      setMessage('Nickname must not be empty');
      return;
    }

    try {
      await login(u, password, n);
      navigate('/bingo');
    } catch (err) {
      setMessage('Invalid username or password');
    }
  };

  const handleCheckGuess = async () => {
    const u = username.trim();
    const n = nickname.trim();
    if (u.length < 3) {
      setMessage('Username must be at least 3 characters');
      return;
    }

    if (n.length < 1) {
      setMessage('Nickname must not be empty');
      return;
    }

    try {
      await loginGuess(u, n);
      if (!user?.isPassword) {
        navigate('/bingo');
      } else {
        setMessage('Please input password');
      }
    } catch (err) {
      setMessage('Invalid username');
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-0" style={{ maxWidth: '460px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
        <div
          style={{
            background: 'linear-gradient(90deg, rgb(158, 159, 233) 0%, rgb(170, 200, 252) 100%)',
            color: '#fff',
            padding: '20px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              margin: '0 auto 8px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            B
          </div>
          <h2 className="mb-1" style={{ fontWeight: 600 }}>
            Bingo
          </h2>
          <small style={{ opacity: 0.9 }}>Sign in to join the game</small>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {message && (
            <div className="alert alert-warning py-2" role="alert">
              {message}
            </div>
          )}

          <div className="mb-3 form-floating">
            <label className="form-label text-info" htmlFor="account">Account</label>
            <input
              type="text"
              id="account"
              maxLength="11"
              className="form-control"
              placeholder="Ex: LongLHH1"
              value={username}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleCheckGuess();
                }
              }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3 form-floating">
            <label className="form-label text-info" htmlFor="nickname">Nickname in the game</label>
            <input
              type="text"
              id="nickname"
              maxLength="17"
              className="form-control"
              placeholder="Ex: Long Lươn Lẹo"
              value={nickname}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleCheckGuess();
                }
              }}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {user?.isPassword && (
            <div className="mb-3 form-floating">
              <input
                type="password"
                id="password"
                maxLength="17"
                className="form-control"
                placeholder="Password"
                value={password}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>
          )}
          <div className="d-grid gap-2">
            {user?.isPassword ? (
              <button
                className="btn"
                onClick={handleSubmit}
                style={{
                  background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: 8,
                }}
              >
                Login
              </button>
            ) : (
              <button
                className="btn"
                onClick={handleCheckGuess}
                style={{
                  background: 'transparent',
                  color: '#2575fc',
                  border: '1px solid #cfe0ff',
                  padding: '10px 14px',
                  borderRadius: 8,
                }}
              >
                Check Account
              </button>
            )}
          </div>

          <div className="text-center mt-3">
            <small style={{ color: '#e02c14' }}>*** Please enter your account correctly to receive points. ***</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
