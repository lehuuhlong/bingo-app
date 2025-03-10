import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import socket from '../services/socket';

const CloseToBingo = (props) => {
  const { bingoName, usersBoard } = props;
  const [nearlyBingoName, setNearlyBingoName] = useState([]);

  useEffect(() => {
    socket.on('nearlyBingo', (name) => {
      setNearlyBingoName(name);
    });

    return () => {
      socket.off('nearlyBingo');
    };
  }, []);

  const numberBingoCells = (num) => {
    let isNumber = false;
    for (let name of bingoName) {
      isNumber = usersBoard[name]?.bingoCells.includes(num);
      if (isNumber) break;
    }

    return isNumber;
  };

  if (nearlyBingoName.length === 0) return null;

  return (
    <div className="mt-4">
      <h5 className="text-warning">
        ⚠️ Users with numbers close to Bingo: <span className="text-dark">{nearlyBingoName.length}</span>
      </h5>
      <ul className="alert alert-warning shadow-sm rounded p-2">
        <AnimatePresence>
          {nearlyBingoName
            .sort((a, b) => usersBoard[b]?.nearlyBingos.length - usersBoard[a]?.nearlyBingos.length)
            .map((name) => (
              <motion.li
                key={name}
                className="ml-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }} className="mb-1">
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        <span>{name}</span>
                      </Tooltip>
                    }
                  >
                    <strong className="mr-2 mb-1">{usersBoard[name]?.nickname}:</strong>
                  </OverlayTrigger>

                  {usersBoard[name]?.nearlyBingos.map((number) => (
                    <motion.div
                      key={number}
                      className={`mr-1 mb-1 rounded-circle d-flex align-items-center justify-content-center number-ball ${
                        bingoName.length > 0 ? (numberBingoCells(number) ? 'bg-success text-white' : 'bg-warning text-dark') : 'bg-warning text-dark'
                      }`}
                      style={{
                        width: '35px',
                        height: '35px',
                        fontSize: '0.8rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p style={{ margin: 0 }}>{number}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default CloseToBingo;
