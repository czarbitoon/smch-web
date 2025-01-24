// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    isAuthenticated ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/login" replace />
    )
  );
};

export default ProtectedRoute;