import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField, CircularProgress, Snackbar } from '@mui/material';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // Use context instead of prop

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/login', { email, password });

      console.log('Login Response:', response.data);
      console.log('Storing token:', response.data.access_token);

      localStorage.setItem('token', response.data.access_token);

      setIsAuthenticated(true); // Update auth state

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
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
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/register')} 
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
