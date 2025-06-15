import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Avatar, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { Build, Report, Person, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';

function UserDashboard() {
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
        
        // Check user role and redirect if necessary
        const userRole = profileRes.data.user.user_type || profileRes.data.user.role;
        if (userRole >= 2) {
          navigate('/admin-dashboard');
        }
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
          User Dashboard
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

      {/* Menu Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/profile')}
            startIcon={<Person />}
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
            Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserDashboard;