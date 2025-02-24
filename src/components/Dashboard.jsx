import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import TransactionTable from './TransactionTable';

const Dashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Chào mừng đến với Dashboard</h2>
      <UserTable token={token} />
      <TransactionTable token={token} />
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Dashboard;
