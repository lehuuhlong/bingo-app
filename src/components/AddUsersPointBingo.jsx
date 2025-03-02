import { useState } from 'react';
import { addUserPointBingo } from '../services/userService';

const AddUsersPointBingo = () => {
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !points) {
      alert('Vui lòng nhập đủ thông tin!');
      return;
    }

    try {
      await addUserPointBingo(username, parseInt(points));
      setUsername('');
      setPoints('');
    } catch (error) {
      console.error('Error when add user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h5>Input userName Bingo and Points Bingo</h5>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="number" className="form-control" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
          <button className="btn btn-primary" type="submit">
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsersPointBingo;
