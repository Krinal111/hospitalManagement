import axios from "axios";
import { refreshAccessToken } from "./authServices";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalReq.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalReq);
      }
    }
    return Promise.reject(err);
  }
);
