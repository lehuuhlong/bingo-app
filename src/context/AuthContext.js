import { createContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthToken(parsedUser.token);
      setUser(parsedUser);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = { ...res.data, token: res.data.token };
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthToken(res.data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
