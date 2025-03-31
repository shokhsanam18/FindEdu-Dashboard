import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Store";

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) return <Navigate to="/Login" />;

  if (!user) {
    return <div className="p-8 text-center">Loading user...</div>; // or a spinner
  }

  if (requiredRole && user.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;