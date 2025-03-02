import { useState } from 'react';
import { addUserPoint } from '../services/userService';

const AddUsersPoint = () => {
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !points) {
      alert('Vui lòng nhập đủ thông tin!');
      return;
    }

    try {
      await addUserPoint(username, parseInt(points));
      setUsername('');
      setPoints('');
    } catch (error) {
      console.error('Error when add user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h5>Input userName Bingo and Points</h5>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="number" className="form-control" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
          <button className="btn btn-primary ml-3" type="submit">
            Add point
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsersPoint;
