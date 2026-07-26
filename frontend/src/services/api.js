import axios from "axios";

const api = axios.create({
  baseURL: "https://prepai-backend-cas5.onrender.com/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("prepai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
