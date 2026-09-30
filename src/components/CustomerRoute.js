import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CustomerRoute() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default CustomerRoute;