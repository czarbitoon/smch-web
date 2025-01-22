// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [user, setUser ] = useState({
    name: '',
    email: '',
    avatar: 'https://via.placeholder.com/150',
  });

  useEffect(() => {
    // Fetch user profile from the Laravel API
    axios.get('http://127.0.0.1:8000/api/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        console.log('Profile API Response:', response.data);
        setUser (response.data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Avatar
          alt={user.name}
          src={user.avatar}
          sx={{ width: 100, height: 100, margin: 'auto' }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>
      </Box>
    </Container>
  );
};

export default Profile;