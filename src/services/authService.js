import { api } from './api';

export const postLogin = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const postLoginGuess = async (username) => {
  const res = await api.post('/auth/login-guess', { username });
  return res.data;
};

export const changePassword = async (username, password, newPassword) => {
  const res = await api.post('/auth/change-password', { username, password, newPassword });
  return res.data;
};

export const createPassword = async (username, password) => {
  const res = await api.post('/auth/create-password', { username, password });
  return res.data;
};
