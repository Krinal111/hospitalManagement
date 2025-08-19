import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { accessToken } = useAuth();

  // If logged in, redirect to home
  if (accessToken) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
