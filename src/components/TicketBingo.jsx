import React from 'react';

const TicketBingo = (props) => {
  const { handleResetBingo, countResetBingo, bingoName, calledNumbers, usersBoard, username, board, isBingo, bingoCells } = props;
  return (
    <div className="text-center mb-4">
      <h4 className="text-secondary">🎲 Ticket Bingo 🎲</h4>
      <button
        className="btn btn-warning mb-2"
        onClick={handleResetBingo}
        disabled={countResetBingo === 3 || bingoName.length > 0 || calledNumbers.length > 0 || usersBoard[username]?.countReset === 0}
      >
        Reset your bingo! (Remain: {3 - countResetBingo})
      </button>
      {isBingo && <div className="alert alert-success text-center">🎉 Bingo! 🎉</div>}
      <div className="bg-gradient-light p-3 rounded shadow">
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', display: 'inline-grid' }}>
          {board.flat().map((num, index) => (
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
              style={{ width: '60px', height: '60px', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {num}
            </div>
          ))}
        </div>
        {board.length === 0 && (
          <h5>
            Opps!!! You're late! <br /> Please wait the next lucky-draw
          </h5>
        )}
      </div>
    </div>
  );
};

export default TicketBingo;
