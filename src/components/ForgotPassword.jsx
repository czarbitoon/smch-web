// src\components\ForgotPassword.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField, CircularProgress, Snackbar } from '@mui/material';
import axios from '../axiosInstance';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/forgot-password', { email });
      
      console.log(response.data);
      setSuccess(true);
    } catch (error) {
      console.error('Password Reset Error:', error.response ? error.response.data : error.message);
      if (error.response) {
        if (error.response.status === 404) {
          setError('Email address not found.');
        } else if (error.response.status === 429) {
          setError('Too many attempts. Please try again later.');
        } else {
          setError(error.response.data.message || 'Failed to send password reset link. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleForgotPassword}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Password Reset Link'}
          </Button>
        </form>
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
          sx={{ '& .MuiSnackbarContent-root': { bgcolor: 'error.main' } }}
        />
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          message="Password reset link has been sent to your email!"
          sx={{ '& .MuiSnackbarContent-root': { bgcolor: 'success.main' } }}
        />
      </Box>
    </Container>
  );
}

export default ForgotPassword;
