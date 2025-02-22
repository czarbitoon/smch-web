// src/components/UserDashboard.jsx

import React, { useEffect, useState } from 'react';
import { CircularProgress, Alert, Container, Typography, Box, Button, Avatar, Grid, Paper } from '@mui/material';
import { Assignment, NotificationsActive, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from '../axiosInstance'; // Import the custom Axios instance

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDevices: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');

      try {
        // First get the profile to determine the role
        const profileRes = await axios.get('/profile');
        
        // Ensure we have valid user data and handle nested structures
        if (!profileRes.data) {
          throw new Error('No data received from server');
        }

        // Handle potential nested user object structures
        const userData = profileRes.data.user || profileRes.data;

        // Add detailed console logging
        console.log('Full profile response:', profileRes.data);
        console.log('Extracted user data:', userData);
        
        // Check user type (0=user, 1=staff, 2=admin, 3=superadmin)
        const userType = userData.type || 0;
        
        // Add console log to track user type
        console.log('Detected user type:', userType);
        console.log('Type value:', typeof userType);
        
        // Redirect based on user type
        if (userType === 1) {
          navigate('/staff/dashboard');
          return;
        } else if (userType === 2 || userType === 3) {
          navigate('/admin/dashboard');
          return;
        }

        setUser(userData);
        // Then get the stats for regular user
        const statsRes = await axios.get('/user/stats');
        setStats(statsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Failed to fetch user data. Redirecting to login.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    fetchUserData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
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
                src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}` : 'https://ui-avatars.com/api/?name=User&size=128'}
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
        {/* Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
              <NotificationsActive sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" gutterBottom>{stats.totalDevices}</Typography>
              <Typography variant="subtitle1">Devices in Your Office</Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>My Devices</Typography>
              <Typography variant="body1" paragraph>View and manage your assigned devices.</Typography>
              <Button variant="contained" color="primary" href="/devices">View Devices</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>My Reports</Typography>
              <Typography variant="body1" paragraph>Track and manage your submitted reports.</Typography>
              <Button variant="contained" color="primary" href="/reports">View Reports</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default UserDashboard;