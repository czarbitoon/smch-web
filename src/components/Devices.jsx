import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  TextField, 
  Snackbar,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import axios from 'axios';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/devices`);
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
        issue_description: issueDescription
      });
      setIssueDescription('');
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
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          {devices.map(device => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {device.name}
                </Typography>
                <Box sx={{ marginBottom: 2 }}>
                  <Chip 
                    label={`Status: ${device.status}`} 
                    color={device.status === 'active' ? 'success' : 'error'} 
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Device ID: {device.id}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Type: {device.type || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Location: {device.location || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => logIssue(device.id)}
                  >
                    Log Issue
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => getDeviceStatus(device.id)}
                  >
                    Check Status
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
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
