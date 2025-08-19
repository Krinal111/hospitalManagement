import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
import DoctorDiscovery from "../pages/DoctorDiscovery";
import BookSlot from "../pages/BookSlot";
import Dashboard from "../pages/Dashboard";
import DoctorOnboarding from "../pages/DoctorOnboarding";
import DoctorAvailability from "../pages/DoctorAvailability";
import DoctorRecurringAvailability from "../pages/DoctorRecurringAvailability";
import AdminPendingDoctors from "../pages/AdminPendingDoctors";
import DoctorCalendarInteractive from "../pages/DoctorCalendarInteractive";

function AppRoutes() {
  const routes = useRoutes([
    {
      element: <ProtectedRoute />, // no children passed
      children: [
        { path: "/", element: <Home /> },
        { path: "/discover", element: <DoctorDiscovery /> },
        { path: "/book/:slotId", element: <BookSlot /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/doctor/onboarding", element: <DoctorOnboarding /> },
        { path: "/doctor/availability", element: <DoctorAvailability /> },
        { path: "/doctor/availability/recurring", element: <DoctorRecurringAvailability /> },
        { path: "/doctor/calendar/:doctorId", element: <DoctorCalendarInteractive /> },
        { path: "/admin/pending-doctors", element: <AdminPendingDoctors /> },
      ],
    },
    {
      element: <PublicRoute />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return routes;
}

export default AppRoutes;
