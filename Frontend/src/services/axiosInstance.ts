import axios from "axios";
import { refreshAccessToken } from "../services/authServices";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor → attach token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle expired tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest); // retry with new token
      }
    }

    return Promise.reject(error);
  }
);

export default API;
