// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === null) {
    // Show a loading spinner or placeholder while user data is being fetched
    return <div>Loading...</div>;
  }

  return user && user.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;
