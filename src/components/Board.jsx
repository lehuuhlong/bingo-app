import React, { useContext } from 'react';
import { CallNumbersContext } from '../context/CallNumbersContext';

const Board = (props) => {
  const { bingoName, bingoCells, board, boardStyle = { circle: '60px', numSize: '1.5rem' } } = props;
  const { calledNumbers } = useContext(CallNumbersContext);

  return (
    <div
      className="d-grid"
      style={{
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        display: 'inline-grid',
      }}
    >
      {board?.flat().map((num, index) => (
        <div
          key={index}
          className={`border p-3 rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm ${
            bingoName.length > 0
              ? bingoCells.includes(num)
                ? 'bg-success text-white'
                : calledNumbers.includes(num)
                ? 'bg-secondary text-white'
                : 'bg-light text-dark'
              : calledNumbers.includes(num)
              ? 'bg-success text-white'
              : 'bg-light text-dark'
          }`}
          style={{
            width: boardStyle.circle,
            height: boardStyle.circle,
            fontSize: boardStyle.numSize,
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

export default Board;
