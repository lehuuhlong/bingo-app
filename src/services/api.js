import axios from "axios";

const API_URL = import.meta.env.VITE_APP_SERVER_URL + "/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
