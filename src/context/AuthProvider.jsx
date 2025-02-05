import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Set authenticated state if token exists
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
