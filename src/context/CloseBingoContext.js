import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import socket from '../services/socket';

export const CloseBingoContext = createContext();

const initialCloseBingo = [];

export const CloseBingoProvider = ({ children }) => {
  const [nearlyBingoName, setNearlyBingoName] = useState(initialCloseBingo);

  useEffect(() => {
    socket.on('nearlyBingo', (name) => {
      setNearlyBingoName(name);
    });

    return () => {
      socket.off('nearlyBingo');
    };
  }, []);

  return <CloseBingoContext.Provider value={{ nearlyBingoName, setNearlyBingoName }}>{children}</CloseBingoContext.Provider>;
};

CloseBingoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
