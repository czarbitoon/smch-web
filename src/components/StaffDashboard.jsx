// src/components/StaffDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Avatar, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { Assessment, Build, Report } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from '../axiosInstance'; // Import the custom Axios instance

function StaffDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    activeDevices: 0,
    pendingReports: 0,
    resolvedReports: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profileRes, statsRes] = await Promise.all([
          axios.get('/profile'),
          axios.get('/staff/stats')
        ]);
        setUser(profileRes.data.user);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login if there's an error
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Dashboard
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
        {/* Quick Access Buttons */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ flex: 1 }}
                href="/devices"
                startIcon={<Build />}
              >
                Manage Devices
              </Button>
              <Button
                variant="contained"
                color="success"
                href="/add-device"
                startIcon={<Build />}
              >
                Add
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              href="/reports"
              startIcon={<Assessment />}
            >
              View Reports
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="info"
              fullWidth
              href="/devices/add"
              startIcon={<Build />}
            >
              Add New Device
            </Button>
          </Grid>
        </Grid>
        {/* Logout Button */}
        <Box sx={{ marginBottom: 4 }}>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
              <Build sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" gutterBottom>{stats.activeDevices}</Typography>
              <Typography variant="subtitle1">Active Devices</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
              <Report sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
              <Typography variant="h4" gutterBottom>{stats.pendingReports}</Typography>
              <Typography variant="subtitle1">Pending Reports</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
              <Assessment sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
              <Typography variant="h4" gutterBottom>{stats.resolvedReports}</Typography>
              <Typography variant="subtitle1">Resolved Reports</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Manage Reports</Typography>
              <Typography variant="body1" paragraph>View and resolve pending reports.</Typography>
              <Button variant="contained" color="primary" href="/reports">View Reports</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Manage Devices</Typography>
              <Typography variant="body1" paragraph>Monitor and update device status.</Typography>
              <Button variant="contained" color="primary" href="/devices">View Devices</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default StaffDashboard;
