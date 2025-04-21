import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Assume you're using Redux for state management

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux store

  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo.isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
