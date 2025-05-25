import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('user'); // Initialize with 'user' for regular user
  const [officeId, setOfficeId] = useState(null);
  const [user, setUser] = useState(null);

  const logout = async () => { 
    setLoading(true);

    try {
        await axios.post('/api/logout');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole('user');  // Reset role to 'user' on logout
        setUser(null); // Reset user on logout
    } catch (error) {
        setIsAuthenticated(false);
        setUserRole('user');
        setUser(null);
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
          setUserRole('user'); // Ensure default role is 'user'
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get('/api/profile');

        if (isMounted) {
          setIsAuthenticated(response.status === 200);
          // Map numeric type to role string
          let role = 'user';
          const typeValue = response.data?.type;
          if (typeValue === 2 || typeValue === 3) role = 'admin';
          else if (typeValue === 1) role = 'staff';
          setUserRole(role);
          setOfficeId(response.data.office_id);
          setUser({ ...response.data, role }); // Store the full user object with role
        }
      } catch (error) {
        console.error('Session validation failed:', error);

        if (isMounted) {
          setIsAuthenticated(false);
          setUserRole('user'); // Set to default role instead of null
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
      userRole,
      setUserRole,
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
