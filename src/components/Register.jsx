// src\components\Register.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/register', {
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    })
      .then((response) => {
        console.log(response.data);
        alert('Registration successful!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;