import React from 'react'
import Board from './Board';

const View = (props) => {
  const { bingoName, calledNumbers, usersBoard } = props;

  const checkBingo = (board) => {
    if (!board.length) return;
    let newBingoCells = [];

    for (let i = 0; i < 5; i++) {
      if (board[i].every((num) => calledNumbers.includes(num))) {
        newBingoCells.push(...board[i]);
      }

      const column = board.map((row) => row[i]);
      if (column.every((num) => calledNumbers.includes(num))) {
        newBingoCells.push(...column);
      }
    }

    const diagonal1 = [0, 1, 2, 3, 4].map((i) => board[i][i]);
    if (diagonal1.every((num) => calledNumbers.includes(num))) {
      newBingoCells.push(...diagonal1);
    }

    const diagonal2 = [0, 1, 2, 3, 4].map((i) => board[i][4 - i]);
    if (diagonal2.every((num) => calledNumbers.includes(num))) {
      newBingoCells.push(...diagonal2);
    }

    return newBingoCells;
  };

  return (
    <div className="row mb-3">
      {Object.keys(usersBoard).map((key) => {
        const userBoard = usersBoard[key];
        return (
          <>
            <div className="col-4 mb-3">
              {
                userBoard.board.length > 0 && (
                  <>
                    <div className="text-center mb-1">
                      <strong>{userBoard.username}</strong>
                    </div>
                    <div className="bg-gradient-light p-3 rounded shadow">
                      <Board
                        key={userBoard.username}
                        bingoName={bingoName}
                        bingoCells={checkBingo(userBoard.board)}
                        board={userBoard.board}
                        calledNumbers={calledNumbers}
                        boardStyle={{
                          circle: "20px",
                          numSize: "1rem",
                        }}
                      />
                    </div>
                  </>

                )
              }
            </div>
          </>
        );
      })}
      
    </div>
  );
};

export default View
