import { api } from './api';

export const getStatisticsNumber = async (page) => {
  const res = await api.get(`/statistics/number-count?page=${page}&limit=10`);
  return res.data;
};
