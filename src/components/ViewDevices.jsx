// ViewDevices.jsx

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function ViewDevices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/devices')
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        View Devices
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <List>
          {devices.map((device) => (
            <ListItem key={device.id}>
              <ListItemText primary={device.name} secondary={device.description} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default ViewDevices;