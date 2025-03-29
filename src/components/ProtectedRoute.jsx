import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Store";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;