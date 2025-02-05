import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField, CircularProgress, Snackbar } from '@mui/material';
import axios from '../axiosInstance'; // Import the custom Axios instance
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

function Login({ setAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      // Fetch CSRF token and login in one step
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/login', {
        email: email,
        password: password,
      });

      console.log('Login Response:', response.data);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.access_token);

      // Set authenticated state
      setAuthenticated(true);

      // Redirect to the dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: '#f5f5f5', padding: 4, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ textAlign: 'center' }}>
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
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ marginTop: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
        {error && (
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError('')}
            message={error}
          />
        )}
      </Box>
    </Container>
  );
}

// PropTypes validation
Login.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
};

export default Login;
