import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppSidebarLayout from "../components/AppSidebar";

const ProtectedRoute = () => {
  const { accessToken } = useAuth();

  // If no access token, redirect to login
  if (!accessToken) return <Navigate to="/login" replace />;

  return (
    <AppSidebarLayout>
      <Outlet />
    </AppSidebarLayout>
  );
};

export default ProtectedRoute;
