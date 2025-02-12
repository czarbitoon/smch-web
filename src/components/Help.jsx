import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Help = () => {
  const [helpTopics, setHelpTopics] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    // Fetch help topics from the API
    const fetchHelpTopics = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/help`);
        setHelpTopics(response.data);
      } catch (error) {
        setError('Error fetching help topics'); // Set error message
        console.error('Error fetching help topics:', error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchHelpTopics();
  }, []);

  if (loading) {
    return <CircularProgress />; // Show loading indicator
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Help
      </Typography>
      {error && <Alert severity="error">{error}</Alert>} {/* Error Message */}
      <Box sx={{ marginTop: 4 }}>
        {/* Help topics content goes here */}
        {helpTopics.map(topic => (
          <Typography key={topic.id} variant="body1">
            {topic.title}: {topic.description}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default Help;
