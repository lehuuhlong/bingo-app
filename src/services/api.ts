import axios from 'axios';
import { SERVER } from '../configs';

export const api = axios.create({
  baseURL: SERVER.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
