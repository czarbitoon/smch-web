import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    // Fetch feedback from the API
    const fetchFeedback = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/feedback`);
        setFeedbackList(response.data);
      } catch (error) {
        setError('Error fetching feedback'); // Set error message
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return <CircularProgress />; // Show loading indicator
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Feedback
      </Typography>
      {error && <Alert severity="error">{error}</Alert>} {/* Error Message */}
      <Box sx={{ marginTop: 4 }}>
        {/* Feedback content goes here */}
        {feedbackList.map(feedback => (
          <Typography key={feedback.id} variant="body1">
            {feedback.message}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default Feedback;
