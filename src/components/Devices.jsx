import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';

const Devices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Fetch devices from the API
    axios.get('http://127.0.0.1:8000/api/showDevice')
      .then(response => setDevices(response.data))
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  const logIssue = (deviceId) => {
    // Logic to log an issue for the device
    axios.post('http://127.0.0.1:8000/api/logIssue', {
      device_id: deviceId,
      issue_description: 'Issue description here' // Replace with actual input
    })
    .then(response => {
      console.log(response.data.message);
    })
    .catch(error => console.error('Error logging issue:', error));
  };

  const getDeviceStatus = (deviceId) => {
    // Logic to get the status of the device
    axios.get(`http://127.0.0.1:8000/api/deviceStatus/${deviceId}`)
      .then(response => {
        alert(`Device Status: ${response.data.status}`);
      })
      .catch(error => console.error('Error fetching device status:', error));
  };

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
              <Button onClick={() => logIssue(device.id)}>Log Issue</Button>
              <Button onClick={() => getDeviceStatus(device.id)}>Get Status</Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Devices;
