import { api } from './api';

export const getTransactions = async (page) => {
  const res = await api.get(`/transaction?page=${page}&limit=10`);
  return res.data;
};
