// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    reportsGenerated: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats from the Laravel API
    axios.get('http://127.0.0.1:8000/api/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        console.log('Dashboard API Response:', response.data);
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <Grid container spacing={3}>
          {/* Card 1: Total Devices */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Devices
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.totalDevices}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Active Devices */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Active Devices
                </Typography>
                <Typography variant="h4" color="secondary">
                  {stats.activeDevices}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Reports Generated */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Reports Generated
                </Typography>
                <Typography variant="h4" color="textSecondary">
                  {stats.reportsGenerated}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;