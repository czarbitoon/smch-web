import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Avatar, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Assessment, 
  Build, 
  Report, 
  People, 
  Logout,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from '../axiosInstance';
import { sequentialFetch } from '../utils/fetchUtils';
import { CompleteDashboardSkeleton, StatsCardsSkeleton } from './DashboardSkeleton';
import HealthChart from './HealthChart';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Container maxWidth="lg" sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <CompleteDashboardSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Section - Mission Control Style */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 5, 
          px: 1,
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900, 
              color: 'primary.main', 
              letterSpacing: 1,
              mb: 0.5
            }}
          >
            Mission Control
          </Typography>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            Hardware Monitoring System
          </Typography>
        </Box>
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
            fontSize: '1rem',
            boxShadow: 3,
            transition: 'all 0.3s ease-in-out',
            '&:hover': { 
              background: 'error.dark', 
              transform: 'translateY(-2px)',
              boxShadow: 6
            }
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Alert Section */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            fontSize: 16, 
            borderRadius: 2,
            animation: 'slideDown 0.3s ease-in-out',
            '@keyframes slideDown': {
              from: { transform: 'translateY(-20px)', opacity: 0 },
              to: { transform: 'translateY(0)', opacity: 1 }
            }
          }}
        >
          {error}
        </Alert>
      )}

      {/* Profile Card - Enhanced */}
      {user && (
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            mb: 5, 
            borderRadius: 4, 
            textAlign: 'center',
            bgcolor: 'background.paper',
            boxShadow: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            },
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: 8,
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm="auto" sx={{ mx: 'auto', textAlign: 'center' }}>
              <Avatar
                src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}` : undefined}
                sx={{ 
                  width: 96, 
                  height: 96, 
                  mx: 'auto', 
                  backgroundColor: 'primary.light',
                  border: `4px solid ${theme.palette.primary.dark}`, 
                  boxShadow: 3,
                  fontSize: 40, 
                  fontWeight: 700
                }}
              >
                {!user.profile_picture && user.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 0.5, 
                  color: 'primary.main', 
                  letterSpacing: 0.5 
                }}
              >
                {user.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: 16, mb: 1 }}
              >
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Chip 
                  label="Administrator" 
                  color="primary" 
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Section Divider */}
      <Box sx={{ mb: 5, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* System Health Chart */}
      <HealthChart stats={stats} />

      {/* Section Divider */}
      <Box sx={{ mb: 5, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* Stats Widgets - Card-based Stats */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: 'text.primary',
          letterSpacing: 0.5
        }}
      >
        System Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4, 
              bgcolor: 'background.paper', 
              boxShadow: 4,
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme.palette.primary.main
              },
              '&:hover': { 
                boxShadow: 8, 
                transform: 'translateY(-4px)',
                backgroundColor: `${theme.palette.primary.main}08`
              }
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '50%', 
                backgroundColor: `${theme.palette.primary.main}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <People sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
            </Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: 'text.secondary', 
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Total Users
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: 'primary.main', 
                fontSize: 36 
              }}
            >
              {stats.users}
            </Typography>
          </Paper>
        </Grid>

        {/* Devices Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4, 
              bgcolor: 'background.paper', 
              boxShadow: 4,
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme.palette.success.main
              },
              '&:hover': { 
                boxShadow: 8, 
                transform: 'translateY(-4px)',
                backgroundColor: `${theme.palette.success.main}08`
              }
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '50%', 
                backgroundColor: `${theme.palette.success.main}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Build sx={{ fontSize: 32, color: 'success.main' }} />
              </Box>
            </Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: 'text.secondary', 
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Active Devices
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: 'success.main', 
                fontSize: 36 
              }}
            >
              {stats.devices}
            </Typography>
          </Paper>
        </Grid>

        {/* Reports Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4, 
              bgcolor: 'background.paper', 
              boxShadow: 4,
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme.palette.warning.main
              },
              '&:hover': { 
                boxShadow: 8, 
                transform: 'translateY(-4px)',
                backgroundColor: `${theme.palette.warning.main}08`
              }
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '50%', 
                backgroundColor: `${theme.palette.warning.main}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Report sx={{ fontSize: 32, color: 'warning.main' }} />
              </Box>
            </Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: 'text.secondary', 
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Total Tickets
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: 'warning.main', 
                fontSize: 36 
              }}
            >
              {stats.reports}
            </Typography>
          </Paper>
        </Grid>

        {/* Offices Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4, 
              bgcolor: 'background.paper', 
              boxShadow: 4,
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme.palette.info.main
              },
              '&:hover': { 
                boxShadow: 8, 
                transform: 'translateY(-4px)',
                backgroundColor: `${theme.palette.info.main}08`
              }
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '50%', 
                backgroundColor: `${theme.palette.info.main}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Assessment sx={{ fontSize: 32, color: 'info.main' }} />
              </Box>
            </Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: 'text.secondary', 
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Offices
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: 'info.main', 
                fontSize: 36 
              }}
            >
              {stats.offices}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Section Divider */}
      <Box sx={{ mb: 5, borderBottom: 2, borderColor: 'divider', width: '100%' }} />

      {/* Navigation Menu - Enterprise Style */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700, 
          mb: 3, 
          color: 'text.primary',
          letterSpacing: 0.5
        }}
      >
        Quick Navigation
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/devices')}
            startIcon={<Build />}
            sx={{
              py: 3,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: 3,
              letterSpacing: 0.5,
              bgcolor: 'primary.main',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                bgcolor: 'primary.dark', 
                transform: 'translateY(-2px)',
                boxShadow: 6
              }
            }}
          >
            Manage Devices
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/offices')}
            startIcon={<Assessment />}
            sx={{
              py: 3,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: 3,
              letterSpacing: 0.5,
              bgcolor: 'success.main',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                bgcolor: 'success.dark', 
                transform: 'translateY(-2px)',
                boxShadow: 6
              }
            }}
          >
            View Offices
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/reports')}
            startIcon={<Report />}
            sx={{
              py: 3,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: 3,
              letterSpacing: 0.5,
              bgcolor: 'warning.main',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                bgcolor: 'warning.dark', 
                transform: 'translateY(-2px)',
                boxShadow: 6
              }
            }}
          >
            View Tickets
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/users')}
            startIcon={<People />}
            sx={{
              py: 3,
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: 3,
              letterSpacing: 0.5,
              bgcolor: 'info.main',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                bgcolor: 'info.dark', 
                transform: 'translateY(-2px)',
                boxShadow: 6
              }
            }}
          >
            Manage Users
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
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




