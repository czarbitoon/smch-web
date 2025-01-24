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
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
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