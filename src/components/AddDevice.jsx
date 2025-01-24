// src\components\AddDevice.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function AddDevice() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [officeId, setOfficeId] = useState('');

  const handleAddDevice = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/devices', {
      name: name,
      description: description,
      office_id: officeId,
    })
      .then((response) => {
        console.log(response.data);
        alert('Device added successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Device
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <form onSubmit={handleAddDevice}>
          <TextField
            label="Device Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Device Description"
            type="text"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            label="Office ID"
            type="number"
            fullWidth
            margin="normal"
            value={officeId}
            onChange={(e) => setOfficeId(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Device
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddDevice;