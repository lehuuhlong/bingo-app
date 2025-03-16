import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CallNumbersContext = createContext();

const initialCalledNumbers = [];

export const CallNumbersProvider = ({ children }) => {
  const [calledNumbers, setCalledNumbers] = useState(initialCalledNumbers);

  return <CallNumbersContext.Provider value={{ calledNumbers, setCalledNumbers }}>{children}</CallNumbersContext.Provider>;
};

CallNumbersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
