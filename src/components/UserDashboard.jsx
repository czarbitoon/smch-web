// src/components/UserDashboard.jsx

import React, { useEffect, useState } from 'react';
import { CircularProgress, Alert } from '@mui/material'; // Import CircularProgress and Alert

import { Container, Typography, Box, Button, Avatar, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from '../axiosInstance'; // Import the custom Axios instance

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true

      try {
        const response = await axios.get('/profile'); // Fetch user profile
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Redirecting to login.'); // Set error message
        setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds

      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/logout'); // Call the logout API
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (loading) {
    return <CircularProgress />; // Show loading indicator
  }

  return (

    <Container maxWidth="lg">
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        {error && <Alert severity="error">{error}</Alert>} {/* Error Message */}
        <Typography variant="h4" component="h1" gutterBottom>

          User Dashboard
        </Typography>

        {/* Profile Section */}
        {user && (
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Avatar
                src={user.profile_picture ? `http://127.0.0.1:8000/storage/${user.profile_picture}` : 'https://via.placeholder.com/150'}
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body1" color="textSecondary">{user.email}</Typography>
              </Box>
            </Box>
            <ProfilePictureUpload />
          </Paper>
        )}

        {/* Logout Button */}
        <Box sx={{ marginBottom: 4 }}>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Dashboard Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                View Devices
              </Typography>
              <Typography variant="body1">
                View all devices assigned to you.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                View Reports
              </Typography>
              <Typography variant="body1">
                View all reports submitted by you.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default UserDashboard;
