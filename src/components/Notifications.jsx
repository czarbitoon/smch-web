import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`);
        setNotifications(response.data);
      } catch (error) {
        setError('Error fetching notifications'); // Set error message
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <CircularProgress />; // Show loading indicator
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>
      {error && <Alert severity="error">{error}</Alert>} {/* Error Message */}
      <Box sx={{ marginTop: 4 }}>
        {/* Notifications content goes here */}
        {notifications.map(notification => (
          <Typography key={notification.id} variant="body1">
            {notification.message}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default Notifications;
