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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if ((error.response?.status === 401 || error.response?.status === 403) &&!isAuthEndpoint){
      localStorage.removeItem("prepai_token");
      localStorage.removeItem("prepai_name");
      localStorage.removeItem("prepai_email");
      window.location.href = "/login?expired=true";
    }
    return Promise.reject(error);
  }
);

export default api;