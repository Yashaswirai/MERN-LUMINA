import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === null) {
    // Show a loading spinner while user data is being fetched
    return <LoadingSpinner fullScreen />;
  }

  return user && user.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
