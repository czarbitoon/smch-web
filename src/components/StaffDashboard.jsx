// src/components/StaffDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Avatar, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { Build, Report, Person, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';

function StaffDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get('/api/profile');
        setUser(profileRes.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, backgroundColor: '#f4f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', letterSpacing: 0.5 }}>
          Staff Dashboard
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1,
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(229, 57, 53, 0.12)'
          }}
        >
          Logout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Card */}
      {user && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3, 
            textAlign: 'center',
            backgroundColor: '#fff',
            boxShadow: '0 3px 8px rgba(0,0,0,0.10)'
          }}
        >
          <Avatar
            src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}` : undefined}
            sx={{ 
              width: 72, 
              height: 72, 
              mx: 'auto', 
              mb: 2,
              backgroundColor: '#90caf9'
            }}
          >
            {!user.profile_picture && user.name?.charAt(0)}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Paper>
      )}

      {/* Menu Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/devices')}
            startIcon={<Build />}
            sx={{
              py: 2,
              borderRadius: 3,
              backgroundColor: '#1976d2',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 3px 8px rgba(25, 118, 210, 0.15)',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Devices
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/reports')}
            startIcon={<Report />}
            sx={{
              py: 2,
              borderRadius: 3,
              backgroundColor: '#1976d2',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 3px 8px rgba(25, 118, 210, 0.15)',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Reports
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/profile')}
            startIcon={<Person />}
            sx={{
              py: 2,
              borderRadius: 3,
              backgroundColor: '#1976d2',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 3px 8px rgba(25, 118, 210, 0.15)',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StaffDashboard;
