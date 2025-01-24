// src\components\ForgotPassword.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/forgot-password', {
      email: email,
    })
      .then((response) => {
        console.log(response.data);
        alert('Password reset link sent to your email!');
      })
      .catch((error) => {
        console.error(error);
      });
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
          />
          <Button type="submit" variant="contained" color="primary">
            Send Password Reset Link
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default ForgotPassword;