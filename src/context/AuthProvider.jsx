import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance'; // Import the custom Axios instance

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Validate the token by fetching user data
          const response = await axios.get('/profile'); // Updated endpoint
          if (response.status === 200) {
            setIsAuthenticated(true); // Set authenticated state if token is valid
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false); // Set to false if there's an error
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Reset loading state
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Consider adding a spinner here
  }

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
