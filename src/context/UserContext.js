import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
