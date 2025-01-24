// UserDashboard.jsx

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ViewDevices from './ViewDevices';
import ViewReports from './ViewReports';

function UserDashboard() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        User Dashboard
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <ViewDevices />
        <ViewReports />
      </Box>
    </Container>
  );
}

export default UserDashboard;