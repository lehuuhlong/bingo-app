import { useState } from 'react';
import { addUserPoint } from '../services/userService';

const AddPoint = () => {
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
      await addUserPoint(username, parseInt(points));
      setUsername('');
      setPoints('');
    } catch (error) {
      console.error('Error when add user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h5>Add Points</h5>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="number" className="form-control" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
          <input type="text" className="form-control" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn-primary ml-3" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPoint;
