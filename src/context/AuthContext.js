import { createContext, useState, useEffect } from 'react';
import { postLogin, postLoginGuess } from '../services/authService';
import { setAuthToken } from '../services/setAuthToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthToken(parsedUser.token);
      setUser(parsedUser);
    }
  }, []);

  const login = async (username, password) => {
    const res = await postLogin(username, password);
    const userData = { ...res.data, token: res.data.token };
    localStorage.setItem('token', JSON.stringify(userData));
    setAuthToken(res.data.token);
    setUser(userData);
  };

  const loginGuess = async (username) => {
    const res = await postLoginGuess(username);
    const userData = { ...res.data, token: res.data.token };
    localStorage.setItem('token', JSON.stringify(userData));
    setAuthToken(res.data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, loginGuess, logout }}>{children}</AuthContext.Provider>;
};
