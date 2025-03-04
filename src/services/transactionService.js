import { api } from './api';

export const getTransactions = async (page) => {
  const res = await api.get(`/transaction/all?page=${page}&limit=10`);
  return res.data;
};

export const getTransactionsById = async (page, username) => {
  const res = await api.get(`/transaction/id?page=${page}&limit=10&username=${username}`);
  return res.data;
};
