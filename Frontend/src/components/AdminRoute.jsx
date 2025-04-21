// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
