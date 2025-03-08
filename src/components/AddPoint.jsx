import { useState } from 'react';
import { addUserPoint } from '../services/userService';

const AddPoint = () => {
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState('');
  const [type, setType] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !points || !type) {
      alert('Vui lòng nhập đủ thông tin!');
      return;
    }

    try {
      await addUserPoint(username, parseInt(points), type, note);
      setUsername('');
      setPoints('');
      setType('');
      setNote('');
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
          <input type="number" className="form-control ml-2" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
          <select className="form-control ml-2" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" disabled>
              Select...
            </option>
            <option value="Add Point">Add Point</option>
            <option value="Gift Point">Gift Point</option>
            <option value="Ticket Bingo">Ticket Bingo</option>
            <option value="Refund Point">Refund Point</option>
            <option value="Bingo Reward">Bingo Reward</option>
          </select>
          <input type="text" className="form-control ml-2" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn-primary ml-3" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPoint;
