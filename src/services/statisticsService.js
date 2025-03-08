import { api } from './api';

export const getStatisticsNumber = async (page, number) => {
  const res = await api.get(`/statistics/number-count?page=${page}&limit=10&number=${number}`);
  return res.data;
};
