import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField, CircularProgress } from '@mui/material';
import axios from '../axiosInstance'; // Import the custom Axios instance

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await axios.post('/login', { // Use the custom Axios instance
        email: email,
        password: password,
      });

      console.log('Login Response:', response.data);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.access_token);

      // Redirect to the dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
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
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
