// src/components/Devices.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Devices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Fetch devices from the API
    axios.get('http://127.0.0.1:8000/api/devices')
      .then(response => setDevices(response.data))
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Devices
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <List>
          {devices.map(device => (
            <ListItem key={device.id}>
              <ListItemText primary={device.name} secondary={`ID: ${device.id}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Devices;