// src/components/UserDashboard.jsx

import React, { useEffect, useState } from 'react';
import { CircularProgress, Alert, Container, Typography, Box, Button, Avatar, Grid, Paper } from '@mui/material';
import { Assignment, History } from '@mui/icons-material';
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
        const profileRes = await axios.get('/api/profile');
        
        // Ensure we have valid user data and handle nested structures
        if (!profileRes.data) {
          throw new Error('No data received from server');
        }

        // Handle potential nested user object structures
        const userData = profileRes.data.user || profileRes.data;
        // Use user_role string for routing
        const userRole = userData.user_role || 'user';
        if (userRole === 'staff') {
          navigate('/staff/dashboard');
          return;
        } else if (userRole === 'admin' || userRole === 'superadmin') {
          navigate('/admin/dashboard');
          return;
        }
        setUser(userData);
        // Then get the stats for regular user
        const statsRes = await axios.get('/api/user/stats');
        setStats(statsRes.data);
        setLoading(false);
      } catch (error) {
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
      await axios.post('/api/logout'); // Call the logout API
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
              {/* Removed NotificationsActive icon */}
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