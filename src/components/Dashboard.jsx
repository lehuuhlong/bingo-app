import { useState, useEffect } from 'react';
import { getUsersPoint } from '../services/userService';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsersPoint();
    setUsers(data);
  };

  return (
    <div className="">
      <h4 className="text-secondary text-center">Ranking🥇🥈🥉</h4>
      <ul className="list-unstyled text-center">
        {users.map((user, index) => {
          let bgColor = 'alert-warning';
          let rankEmoji = `${index + 1}️⃣`;

          if (index === 0) {
            bgColor = 'alert-primary';
            rankEmoji = '🥇';
          }
          if (index === 1) {
            bgColor = 'alert-info';
            rankEmoji = '🥈';
          }
          if (index === 2) {
            bgColor = 'alert-success';
            rankEmoji = '🥉';
          }

          return (
            <li key={user._id} className={`alert ${bgColor} p-2 rounded shadow-sm`}>
              {rankEmoji} <strong>{user.username}</strong> - Bingo: <strong>{user.bingoCount}</strong> - Point: <strong>{user.points}</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dashboard;
