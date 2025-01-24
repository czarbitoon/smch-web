// src\components\StaffDashboard.jsx

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ViewReports from './ViewReports';
import ResolveReport from './ResolveReport';
import AddDevice from './AddDevice';
import ViewDevices from './ViewDevices';

function StaffDashboard() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Staff Dashboard
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <ViewReports />
        <ResolveReport />
        <AddDevice />
        <ViewDevices />
      </Box>
    </Container>
  );
}

export default StaffDashboard;