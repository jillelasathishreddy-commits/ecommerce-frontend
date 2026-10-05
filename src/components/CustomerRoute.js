import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CustomerRoute() {

  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default CustomerRoute;