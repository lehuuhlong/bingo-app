import { api } from './api';

export const getUsersPoint = async () => {
  const res = await api.get('/point');
  return res.data;
};

export const addUserPoint = async (username, points, bingoCount = 1) => {
  const res = await api.post('/point', { username, points, bingoCount });
  return res.data;
};
