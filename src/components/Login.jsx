import React from 'react';

const Login = (props) => {
  const { handleConfirm, setUsername, username, nickname, setNickname, password, setPassword } = props;
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
              handleConfirm();
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
              handleConfirm();
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
                handleConfirm();
              }
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      <button className="btn btn-primary" onClick={handleConfirm}>
        Login
      </button>
    </div>
  );
};

export default Login;
