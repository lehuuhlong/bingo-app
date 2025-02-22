import axios from 'axios';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api/auth';

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
