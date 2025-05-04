import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField, CircularProgress, Snackbar } from '@mui/material';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext
import { userService } from '../services/api'; // Import userService

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole } = useContext(AuthContext); // Use context instead of prop


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use userService instead of direct axios call
      const response = await userService.login({ email, password });

      localStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      
      // Map numeric type to role string
      let role = 'user';
      const typeValue = response.data.Type;
      if (typeValue === 2 || typeValue === 3) role = 'admin';
      else if (typeValue === 1) role = 'staff';
      setUserRole(role);
      // Navigate to the appropriate dashboard based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/user/dashboard');
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Incorrect password.');
        } else if (error.response.status === 404) {
          setError('Email not found. Please check your email or register.');
        } else if (error.response.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
      <Box sx={{ width: '100%', maxWidth: 400 }}>        
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center', color: '#212121', fontWeight: 600 }}>
          Welcome Back
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
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading} 
            fullWidth 
            sx={{ 
              py: 1.5,
              mb: 2,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
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
    </Box>
    </Container>
  );
}

export default Login;



