import { createContext, useState, useEffect } from 'react';
import { postLogin, postLoginGuess } from '../services/authService';
import { setAuthToken } from '../services/setAuthToken';
import { getUserById } from '../services/userService';

export const AuthContext = createContext();

const userClass = {
  username: '',
  nickname: '',
  role: '',
  isPassword: false,
  isLogin: false,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userClass);

  useEffect(() => {
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthToken(parsedUser.token);
      const fetchUser = async () => {
        const data = await getUserById(parsedUser.user.username);
        setUser({ ...data, nickname: parsedUser.user.nickname, isPassword: parsedUser.user.isPassword, isLogin: true });
      };

      fetchUser();
    }
  }, []);

  const login = async (username, password, nickname) => {
    const res = await postLogin(username, password);

    // Save user to localStorage and context
    let userData = { ...res.user, nickname, isLogin: true };
    let token = { ...res, user: userData };
    localStorage.setItem('token', JSON.stringify(token));
    setAuthToken(res.token);
    setUser(userData);
  };

  const loginGuess = async (username, nickname) => {
    const res = await postLoginGuess(username);

    if (res.user.isPassword) {
      setUser({ ...res.user, nickname });
      return;
    }

    // Save user to localStorage and context
    let userData = { ...res.user, nickname, isLogin: true };
    let token = { ...res, user: userData };
    localStorage.setItem('token', JSON.stringify(token));
    setAuthToken(res.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(userClass);
    setAuthToken(null);
    window.location.reload();
  };

  return <AuthContext.Provider value={{ user, login, loginGuess, logout }}>{children}</AuthContext.Provider>;
};
