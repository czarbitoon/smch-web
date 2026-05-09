import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Avatar, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { Assessment, Build, Report, People, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from '../axiosInstance';
import { sequentialFetch } from '../utils/fetchUtils';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    users: 0,
    devices: 0,
    reports: 0,
    offices: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Use sequential fetching to avoid overwhelming ngrok tunnel
        const requests = [
          { url: '/api/profile', label: 'Profile' },
          { url: '/api/admin/stats', label: 'Admin Stats' }
        ];
        
        const results = await sequentialFetch(requests, axios, 300);
        
        // Process profile
        const profileResult = results[0];
        if (profileResult.success) {
          setUser(profileResult.data.user);
        }
        
        // Process stats
        const statsResult = results[1];
        if (statsResult.success) {
          const statsRes = statsResult.data;
          if (statsRes && typeof statsRes === 'object') {
            if (statsRes.stats) {
              setStats({
                users: statsRes.stats.users ?? 0,
                devices: statsRes.stats.devices ?? 0,
                reports: statsRes.stats.reports ?? 0,
                offices: statsRes.stats.offices ?? 0,
              });
            } else {
              setStats({
                users: statsRes.users ?? statsRes.totalUsers ?? 0,
                devices: statsRes.devices ?? statsRes.totalDevices ?? 0,
                reports: statsRes.reports ?? statsRes.totalReports ?? 0,
                offices: statsRes.offices ?? statsRes.totalOffices ?? 0,
              });
            }
          }
        }
        
        // Check for any errors
        const hasErrors = results.some(r => !r.success);
        if (hasErrors) {
          setError('Some dashboard data could not be loaded');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Only run once on mount

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
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: 'background.default' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, px: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.dark', letterSpacing: 1 }}>
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: 3,
            transition: 'all 0.2s',
            '&:hover': { background: 'error.dark', transform: 'scale(1.04)' }
          }}
        >
          Logout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, fontSize: 18, borderRadius: 2 }}>{error}</Alert>
      )}

      {/* Profile Card */}
      {user && (
        <Paper 
          elevation={6} 
          sx={{ 
            p: 5, mb: 5, borderRadius: 4, textAlign: 'center',
            bgcolor: 'background.paper',
            boxShadow: 6,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <Avatar
            src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}` : undefined}
            sx={{ 
              width: 96, height: 96, mx: 'auto', mb: 2, backgroundColor: 'primary.light',
              border: '4px solid', borderColor: 'primary.dark', boxShadow: 2,
              fontSize: 40, fontWeight: 700
            }}
          >
            {!user.profile_picture && user.name?.charAt(0)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: 'primary.dark', letterSpacing: 0.5 }}>{user.name}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>{user.email}</Typography>
        </Paper>
      )}

      {/* Section Divider */}
      <Box sx={{ mb: 4, mt: 2, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* Stats Widgets */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Stats Widgets */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', boxShadow: 4, transition: 'all 0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.04)' }, cursor: 'pointer' }}>
            <Box sx={{ mb: 1 }}><People sx={{ fontSize: 38, color: 'primary.dark' }} /></Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.dark', fontSize: 18 }}>Users</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', fontSize: 38 }}>{stats.users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', boxShadow: 4, transition: 'all 0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.04)' }, cursor: 'pointer' }}>
            <Box sx={{ mb: 1 }}><Build sx={{ fontSize: 38, color: 'primary.dark' }} /></Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.dark', fontSize: 18 }}>Devices</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', fontSize: 38 }}>{stats.devices}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', boxShadow: 4, transition: 'all 0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.04)' }, cursor: 'pointer' }}>
            <Box sx={{ mb: 1 }}><Report sx={{ fontSize: 38, color: 'primary.dark' }} /></Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.dark', fontSize: 18 }}>Reports</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', fontSize: 38 }}>{stats.reports}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper', boxShadow: 4, transition: 'all 0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.04)' }, cursor: 'pointer' }}>
            <Box sx={{ mb: 1 }}><Assessment sx={{ fontSize: 38, color: 'primary.dark' }} /></Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.dark', fontSize: 18 }}>Offices</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', fontSize: 38 }}>{stats.offices}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Section Divider */}
      <Box sx={{ mb: 4, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* Menu Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/devices')}
            startIcon={<Build />}
            sx={{
              py: 2.5,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: 3,
              mb: 2,
              letterSpacing: 0.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.03)' }
            }}
          >
            Devices
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/offices')}
            startIcon={<Assessment />}
            sx={{
              py: 2.5,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: 3,
              mb: 2,
              letterSpacing: 0.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.03)' }
            }}
          >
            Offices
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/reports')}
            startIcon={<Report />}
            sx={{
              py: 2.5,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: 3,
              mb: 2,
              letterSpacing: 0.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.03)' }
            }}
          >
            Reports
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/users')}
            startIcon={<People />}
            sx={{
              py: 2.5,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: 3,
              mb: 2,
              letterSpacing: 0.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.03)' }
            }}
          >
            Users
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;




