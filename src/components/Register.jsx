import { useState, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState(0); // Default to User (0)
  const { user } = useContext(AuthContext);

  const isAdmin = user?.type === 2 || user?.type === 3; // Check if user is Admin or Super Admin

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = {
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      type: isAdmin ? type : 0 // Force type=0 for non-admin users
    };

    axios.post('http://127.0.0.1:8000/api/register', userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      console.log(response.data);
      alert('User created successfully!');
    })
    .catch((error) => {
      console.error(error);
      alert('Error creating user: ' + (error.response?.data?.message || error.message));
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isAdmin ? 'Create New User' : 'Register'}
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
          {isAdmin && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={type}
                label="Role"
                onChange={(e) => setType(e.target.value)}
                required
              >
                <MenuItem value={0}>User</MenuItem>
                <MenuItem value={1}>Staff</MenuItem>
                <MenuItem value={2}>Admin</MenuItem>
                <MenuItem value={3}>Super Admin</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            {isAdmin ? 'Create User' : 'Register'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
