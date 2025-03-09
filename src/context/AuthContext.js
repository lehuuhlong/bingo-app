import { createContext, useState, useEffect } from 'react';
import { postLogin, postLoginGuess } from '../services/authService';
import { setAuthToken } from '../services/setAuthToken';
import socket from '../services/socket';
import { getUserById } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('token');
    const mode = localStorage.getItem('mode');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      socket.emit('setUsername', { username: parsedUser.user.username, nickname: parsedUser.user.nickname, mode });
      setAuthToken(parsedUser.token);
      const fetchUser = async () => {
        const data = await getUserById(parsedUser.user.username);
        setUser({ ...data, nickname: parsedUser.user.nickname, isPassword: parsedUser.user.isPassword });
      };

      fetchUser();
    }
  }, []);

  const login = async (username, password, nickname) => {
    const res = await postLogin(username, password);

    // Save user to localStorage and context
    let userData = { ...res.user, nickname };
    let token = { ...res, user: userData };
    localStorage.setItem('token', JSON.stringify(token));
    setAuthToken(res.token);
    setUser(userData);
  };

  const loginGuess = async (username, nickname, mode) => {
    const res = await postLoginGuess(username);

    if (res.user.isPassword) {
      setUser({ ...res.user, nickname });
      return;
    }

    // Save user to localStorage and context
    let userData = { ...res.user, nickname };
    let token = { ...res, user: userData };
    localStorage.setItem('token', JSON.stringify(token));
    if(mode === 'view'){
      localStorage.setItem('mode', 'view');
    }
    setAuthToken(res.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mode');
    setAuthToken(null);
    setUser(null);
    window.location.reload();
  };

  return <AuthContext.Provider value={{ user, login, loginGuess, logout }}>{children}</AuthContext.Provider>;
};
