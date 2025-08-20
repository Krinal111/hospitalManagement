import axios from "axios";
import type {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
} from "../types/userTypes";

const API_URL = "http://localhost:5000/api/auth";

// Axios instance for authenticated requests

// --- AUTH SERVICES ---

export const login = async (data: ILoginRequest): Promise<ILoginResponse> => {
  const res = await axios.post(`${API_URL}/login`, data);

  // Store tokens in localStorage
  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data;
};

export const register = async (
  data: IRegisterRequest
): Promise<IRegisterResponse> => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

// Refresh access token using refresh token
export const  refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const res = await axios.post(`${API_URL}/refresh`, { refreshToken });
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data.accessToken;
  } catch (err) {
    console.error("Failed to refresh access token", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

// --- Axios instance with automatic token refresh ---
