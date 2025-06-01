import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Initialize with null, will be set from backend
  const [officeId, setOfficeId] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/login', { email, password });
      const { access_token, user_role } = response.data;
      
      if (access_token) {
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setIsAuthenticated(true);
        
        // Fetch user profile to get complete user data
        const profileRes = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        const userData = profileRes.data;
        const role = userData.role || user_role || 'user';
        
        setUserRole(role);
        setOfficeId(userData.office_id);
        setUser({ ...userData, role });
        
        return { success: true, user: userData, role };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => { 
    setIsLoading(true);

    try {
        await axios.post('/api/logout');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);  // Reset role to null on logout
        setUser(null); // Reset user on logout
        setToken(null);
    } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
        setToken(null);
        console.error('Logout failed:', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (isMounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      setToken(storedToken);

      try {
        const response = await axios.get('/api/profile');

        if (isMounted && response.status === 200) {
          setIsAuthenticated(true);
          // Use backend-provided role string directly
          const role = response.data?.role || response.data?.user_role || 'user';
          setUserRole(role);
          setOfficeId(response.data?.office_id);
          setUser({ ...response.data, role }); // Store the full user object with role
        }
      } catch (error) {
        console.error('Session validation failed:', error);

        if (isMounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return ( 
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated,
      login,
      logout,
      userRole,
      setUserRole,
      officeId,
      user,
      setUser,
      token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = { 
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
