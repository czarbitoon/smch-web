// AdminDashboard.jsx

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddOffice from './AddOffice';
import AddDevice from './AddDevice';
import ViewReports from './ViewReports';

function AdminDashboard() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <AddOffice />
        <AddDevice />
        <ViewReports />
      </Box>
    </Container>
  );
}

export default AdminDashboard;