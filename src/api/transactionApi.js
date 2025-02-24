import axios from "axios";

const API_URL = "http://localhost:4000/api/transactions";

export const getTransactions = async (token) => {
  const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};