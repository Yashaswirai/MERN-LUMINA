import { Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);

  // Use an effect to delay rendering until we're sure about the auth state
  useEffect(() => {
    // If we're not loading anymore, we can render
    if (!loading) {
      // Small delay to ensure state is fully propagated
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading spinner while we determine auth state
  if (loading || !isReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If not loading and no user or not admin, redirect to login
  return user && user.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
