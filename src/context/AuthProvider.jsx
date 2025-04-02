import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(0); // Initialize with 0 for regular user
  const [officeId, setOfficeId] = useState(null);
  const [user, setUser] = useState(null);

  const logout = async () => { 
    setLoading(true);

    try {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserType(0);  // Reset type to 0 on logout
        setUser(null); // Reset user on logout
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
          setUserType(0); // Ensure default type is 0
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get('/api/profile');

        if (isMounted) {
          setIsAuthenticated(response.status === 200);
          // Ensure userType is always a valid number
          const typeValue = response.data?.type;
          const parsedType = Number(typeValue);
          setUserType(Number.isNaN(parsedType) ? 0 : parsedType);
          setOfficeId(response.data.office_id);
          setUser(response.data); // Store the full user object
        }
      } catch (error) {
        console.error('Session validation failed:', error);

        if (isMounted) {
          setIsAuthenticated(false);
          setUserType(0); // Set to default type instead of null
          setUser(null);
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
      userType,
      setUserType,
      officeId,
      user,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = { 
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
