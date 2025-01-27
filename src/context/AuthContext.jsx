// src\context\AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser ] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const expirationTime = localStorage.getItem('expirationTime');
      const currentTime = new Date().getTime();
      if (currentTime < expirationTime) {
        setIsAuthenticated(true);
        axios.get('http://127.0.0.1:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            setUser (response.data);
          })
          .catch((error) => {
            console.error('Error fetching profile:', error);
          });
      } else {
        // Token is expired, refresh it
        axios.post('http://127.0.0.1:8000/api/token/refresh', {
          refresh_token: localStorage.getItem('refreshToken'),
        })
          .then((response) => {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('expirationTime', response.data.expires_in * 1000 + currentTime);
            setIsAuthenticated(true);
            axios.get('http://127.0.0.1:8000/api/profile', {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            })
              .then((response) => {
                setUser (response.data);
              })
              .catch((error) => {
                console.error('Error fetching profile:', error);
              });
          })
          .catch((error) => {
            console.error('Error refreshing token:', error);
          });
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token, refreshToken, expirationTime) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expirationTime', expirationTime);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationTime');
    setIsAuthenticated(false);
  };

  const updateProfilePicture = (profilePicture) => {
    setUser ((prevUser ) => ({
      ...prevUser ,
      profile_picture: profilePicture,
    }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };