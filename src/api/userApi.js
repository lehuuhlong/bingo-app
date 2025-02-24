import axios from "axios";

const API_URL = "http://localhost:4000/api/users";

export const getUsers = async (token) => {
  const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const updateUserPoints = async (id, amount, type, description, token) => {
  await axios.put(`${API_URL}/${id}/points`, { amount, type, description }, { headers: { Authorization: `Bearer ${token}` } });
};
