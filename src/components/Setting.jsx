import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { changePassword, createPassword } from '../services/authService';

const Setting = () => {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = '';
      if (confirmPassword !== newPassword || newPassword.length <= 4) return;
      if (user?.isPassword) {
        data = await changePassword(user?.username, oldPassword, newPassword);
      } else {
        data = await createPassword(user?.username, newPassword);
      }
      setMessage(data?.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage('Incorrect password');
    }
  };

  return (
    <div className="">
      <h4 className="text-secondary text-center">🔑{user?.isPassword ? 'Change' : 'Create'} Password</h4>
      {message && <h6 className="text-info">{message}</h6>}
      {user?.isPassword && (
        <div className="form-group">
          <label htmlFor="oldPassword" className="font-weight-bold">
            Old password
          </label>
          <input
            type="password"
            maxLength="17"
            id="oldPassword"
            className="form-control mb-2"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="newPassword" className="font-weight-bold">
          New password
        </label>
        <input
          type="password"
          maxLength="17"
          id="newPassword"
          className="form-control mb-2"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="font-weight-bold">
          Confirm password
        </label>
        <input
          type="password"
          maxLength="17"
          id="confirmPassword"
          className="form-control mb-2"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        {user?.isPassword ? 'Change' : 'Create'} Password
      </button>
    </div>
  );
};

export default Setting;
