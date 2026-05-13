import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [officeId, setOfficeId] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 1. Fetch CSRF token
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true
      });

      // 2. Extract CSRF token from cookies
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      // 3. Attempt login with CSRF token
      const response = await axios.post('/api/login', 
        { email, password },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken || '',
            'X-Requested-With': 'XMLHttpRequest',
          },
          withCredentials: true
        }
      );
      
      const { access_token, user_role } = response.data;
      
      if (access_token) {
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setIsAuthenticated(true);
        
        // 3. FETCH PROFILE (Axios interceptor will now use the new token)
        const profileRes = await axios.get('/api/profile');
        
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
      // Clean up on failure
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => { 
    setIsLoading(true);
    try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            await axios.post('/api/logout');
        }
    } catch (error) {
        console.error('Logout API failed:', error);
    } finally {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
        setToken(null);
        setOfficeId(null);
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
          setIsLoading(false);
        }
        return;
      }

      setToken(storedToken);

      try {
        // Axios interceptor handles the Authorization header automatically
        const response = await axios.get('/api/profile');

        if (isMounted && response.status === 200) {
          setIsAuthenticated(true);
          const role = response.data?.role || response.data?.user_role || 'user';
          setUserRole(role);
          setOfficeId(response.data?.office_id);
          setUser({ ...response.data, role });
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        if (isMounted) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkSession();

    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return <div>Loading SMCH Monitoring System...</div>;
  }

  return ( 
    <AuthContext.Provider value={{ 
      isAuthenticated, login, logout, userRole, 
      officeId, user, token, isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = { 
  children: PropTypes.node.isRequired,
};

export default AuthProvider;