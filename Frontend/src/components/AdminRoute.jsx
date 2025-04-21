import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // ✅ This is correct

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
