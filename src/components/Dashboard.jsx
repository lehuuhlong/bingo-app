import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Chào mừng đến với Dashboard</h2>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Dashboard;
