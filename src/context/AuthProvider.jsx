import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

const logout = async () => { 
    setLoading(true); // Set loading to true during logout

    try {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    } catch (error) {
        console.error('Logout failed:', error); // Log any errors during logout
    } finally {
        setLoading(false); // Set loading to false after logout
    }

    setIsAuthenticated(false);
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get('/profile');

        if (isMounted) {
          setIsAuthenticated(response.status === 200);
        }
      } catch (error) {
        console.error('Session validation failed:', error);

        if (isMounted) {
          setIsAuthenticated(false);
          localStorage.removeItem('token'); // Remove invalid token
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner component if available
  }

  return ( 
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = { 
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
