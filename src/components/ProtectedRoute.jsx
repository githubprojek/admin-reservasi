import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/useStoreAuth.js";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    <div className="absolute bg-white">Loading...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
