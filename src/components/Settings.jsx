import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    // Fetch settings from the API
    const fetchSettings = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/settings`);
        setSettings(response.data);
      } catch (error) {
        setError('Error fetching settings'); // Set error message
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <CircularProgress />; // Show loading indicator
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      {error && <Alert severity="error">{error}</Alert>} {/* Error Message */}
      <Box sx={{ marginTop: 4 }}>
        {/* Settings content goes here */}
        {settings.map(setting => (
          <Typography key={setting.id} variant="body1">
            {setting.name}: {setting.value}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default Settings;
