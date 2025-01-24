// src\components\Login.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/login', {
      email: email,
      password: password,
    })
      .then((response) => {
        console.log(response.data);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>
        <Button variant="contained" color="secondary" href="/register">
          Register
        </Button>
        <Button variant="contained" color="secondary" href="/forgot-password">
          Forgot Password
        </Button>
      </Box>
    </Container>
  );
}

export default Login;