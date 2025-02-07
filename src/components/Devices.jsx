import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, TextField, Snackbar } from '@mui/material';
import axios from 'axios';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch devices from the API
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showDevice`);
        setDevices(response.data);
      } catch (error) {
        setError('Error fetching devices');
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const logIssue = async (deviceId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logIssue`, {
        device_id: deviceId,
        issue_description: issueDescription,
      });
      setIssueDescription(''); // Clear input after logging
    } catch (error) {
      setError('Error logging issue');
      console.error('Error logging issue:', error);
    }
  };

  const getDeviceStatus = async (deviceId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/deviceStatus/${deviceId}`);
      alert(`Device Status: ${response.data.status}`);
    } catch (error) {
      setError('Error fetching device status');
      console.error('Error fetching device status:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Devices
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <TextField
          label="Issue Description"
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
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
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      )}
    </Container>
  );
};

export default Devices;