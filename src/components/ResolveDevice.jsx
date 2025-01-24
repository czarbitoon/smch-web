// ResolveDevice.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function ResolveDevice() {
  const [id, setId] = useState('');

  const handleResolveDevice = (e) => {
    e.preventDefault();
    axios.post(`http://127.0.0.1:8000/api/devices/${id}/resolve`)
      .then((response) => {
        console.log(response.data);
        alert('Device resolved successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Resolve Device
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
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
    </Container>
  );
}

export default ResolveDevice;