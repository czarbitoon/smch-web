// ResolveDevice.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField, Snackbar, Alert } from '@mui/material';
import axiosInstance from '../axiosInstance';

function ResolveDevice() {
  const [id, setId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleResolveDevice = (e) => {
    e.preventDefault();
    axiosInstance.post(`/devices/${id}/resolve`)
      .then((response) => {
        setSnackbar({
          open: true,
          message: 'Device resolved successfully!',
          severity: 'success'
        });
      })
      .catch((error) => {
        console.error('Error resolving device:', error.response?.data || error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Error resolving device',
          severity: 'error'
        });
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Resolve Device
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <form onSubmit={handleResolveDevice}>
          <TextField
            label="Device ID"
            type="number"
            fullWidth
            margin="normal"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Resolve Device
          </Button>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ResolveDevice;