import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2>User Management</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.points}</td>
              <td>
                <button className="btn btn-success btn-sm">Add Points</button>
                <button className="btn btn-danger btn-sm ml-2">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
