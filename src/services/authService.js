import { api } from './api';

export const postLogin = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const postLoginGuess = async (username) => {
  const res = await api.post('/auth/login-guess', { username });
  return res.data;
};

export const postRegister = async (username, password) => {
  const res = await api.post('/auth/register', { username, password });
  return res.data;
};
