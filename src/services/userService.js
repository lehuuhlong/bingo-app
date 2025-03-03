import { api } from './api';

export const getUsersPoint = async () => {
  const res = await api.get('/point');
  return res.data;
};

export const getUser = async (username) => {
  const res = await api.get(`/user/id/${username}`);
  return res.data;
};

export const getUsersRanking = async () => {
  const res = await api.get('/user/ranking');
  return res.data;
};

export const addUserPoint = async (username, point) => {
  const res = await api.post('/user/add-point', { username, point });
  return res.data;
};

export const addUserPointBingo = async (username, point) => {
  const res = await api.post('/user/add-point-bingo', { username, point });
  return res.data;
};

export const refundPoint = async (users) => {
  const res = await api.post('/user/refund-point', { users });
  return res.data;
};
