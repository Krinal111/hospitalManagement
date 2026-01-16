import { useAuth } from "../context/AuthContext";
import {
  login as loginService,
  register as registerService,
  refreshAccessToken as refreshService,
} from "../services/authServices";
import type { ILoginRequest, IRegisterRequest } from "../types/userTypes";

export const useAuthActions = () => {
  const { setUser, setAccessToken } = useAuth();

  const login = async (data: ILoginRequest) => {
    const res = await loginService(data);
    setUser(res.user);
    setAccessToken(res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  };

  const register = async (data: IRegisterRequest) => {
    const res = await registerService(data);
    return res;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const refreshAccessToken = async () => {
    const newToken = await refreshService();
    if (newToken) setAccessToken(newToken);
    else logout();
    return newToken;
  };

  return { login, register, logout, refreshAccessToken };
};
