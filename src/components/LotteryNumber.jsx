import React, { useContext, useEffect, useState } from 'react';
import socket from '../services/socket';
import { CallNumbersContext } from '../context/CallNumbersContext';

const LotteryNumber = (props) => {
  const { numberBingCells, bingoName } = props;
  const { calledNumbers, setCalledNumbers } = useContext(CallNumbersContext);
  const [currentSpinningNumber, setCurrentSpinningNumber] = useState('🌟');

  useEffect(() => {
    socket.on('numberCalled', (newCalledNumbers) => {
      if (newCalledNumbers?.length === 0) return;
      const latestNumber = newCalledNumbers[newCalledNumbers.length - 1];

      let randomInterval = setInterval(() => {
        setCurrentSpinningNumber(Math.floor(Math.random() * 75) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(randomInterval);
        setCurrentSpinningNumber(latestNumber);
        setCalledNumbers(newCalledNumbers);
      }, 5000);
    });

    return () => {
      socket.off('numberCalled');
    };
  }, []);

  return (
    <div className="mb-4 text-center">
      <h4 className="text-secondary">
        🎲 Lottery number {calledNumbers.length > 0 && <span className="text-danger">:{calledNumbers.length}</span>} 🎲
      </h4>
      <div className="d-flex flex-wrap gap-2 justify-content-center bg-light p-3 rounded shadow">
        {calledNumbers.map(
          (number, index) =>
            number !== '🌟' && (
              <div
                key={index}
                className={`mr-1 mb-1 rounded-circle d-flex align-items-center justify-content-center number-ball ${
                  bingoName.length > 0 ? (numberBingCells(number) ? 'bg-success text-white' : 'bg-secondary text-white') : 'bg-info text-white'
                }`}
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  animation: 'scaleIn 1s ease-in-out',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    animation: 'spin 1s ease-in-out',
                  }}
                >
                  {number}
                </p>
              </div>
            )
        )}
        {currentSpinningNumber && bingoName.length === 0 && (
          <div
            className="number-ball"
            style={{
              width: '50px',
              height: '50px',
              fontSize: '1.2rem',
              borderRadius: '50%',
              backgroundColor: '#ffc107',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 1s linear infinite',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {currentSpinningNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryNumber;
