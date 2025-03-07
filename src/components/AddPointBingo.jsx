import { useState } from 'react';
import { addUserPointBingo } from '../services/userService';

const AddPointBingo = () => {
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !points) {
      alert('Vui lòng nhập đủ thông tin!');
      return;
    }

    try {
      await addUserPointBingo(username, parseInt(points), note);
      setUsername('');
      setPoints('');
      setNote('');
    } catch (error) {
      console.error('Error when add user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h5>Add Points Bingo</h5>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="number" className="form-control ml-2" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
          <input type="text" className="form-control ml-2" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn-primary ml-3" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPointBingo;
