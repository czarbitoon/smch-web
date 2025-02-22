// src\components\ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
  const { isAuthenticated, userRole } = React.useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === 'admin' || userRole === 'superadmin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'staff') {
      return <Navigate to="/staff/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;
