import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            {/* Add your dashboard statistics here */}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add your recent activity here */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 