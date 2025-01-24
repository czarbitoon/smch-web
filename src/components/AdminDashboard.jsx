// src\components\AdminDashboard.jsx

import React from 'react';
import { Container, Typography, Box, Button, Avatar, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfilePictureUpload from './ProfilePictureUpload';

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = React.useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Profile Section */}
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
                Manage Offices
              </Typography>
              <Typography variant="body1">
                Add, update, or remove offices.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                Manage Devices
              </Typography>
              <Typography variant="body1">
                Add, update, or remove devices.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AdminDashboard;