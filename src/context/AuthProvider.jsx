import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [officeId, setOfficeId] = useState(null);

  const logout = async () => { 
    setLoading(true);

    try {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);  // Reset role on logout
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        setLoading(false);
    }
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
          setUserRole(response.data.role);
          setOfficeId(response.data.office_id);
        }
      } catch (error) {
        console.error('Session validation failed:', error);

        if (isMounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          localStorage.removeItem('token');
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
    return <div>Loading...</div>;
  }

  return ( 
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      logout,
      userRole,
      setUserRole,  // Ensure this is included
      officeId 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = { 
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
