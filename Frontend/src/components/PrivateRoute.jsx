import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
