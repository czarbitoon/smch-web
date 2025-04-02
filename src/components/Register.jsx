import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState(0);
  const [officeId, setOfficeId] = useState('');
  const [offices, setOffices] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const isAdmin = user?.type === 2 || user?.type === 3;

  useEffect(() => {
    // Fetch offices from backend
    axiosInstance.get('/offices')
      .then(response => {
        // Ensure offices is always an array
        let officesData = [];
        if (response.data?.data?.offices && Array.isArray(response.data.data.offices)) {
          officesData = response.data.data.offices;
        } else if (Array.isArray(response.data)) {
          officesData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          officesData = response.data.data;
        }
        console.log('Offices data:', officesData);
        setOffices(officesData);
      })
      .catch(error => {
        console.error('Error fetching offices:', error);
        setOffices([]); // Set to empty array on error
      });
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = {
      name: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      type: isAdmin ? type : 0,
      office_id: officeId
    };

    axiosInstance.post('/register', userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then((response) => {
      console.log(response.data);
      alert('User created successfully!');
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/login');
      }

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
          <FormControl fullWidth margin="normal">
            <InputLabel>Office</InputLabel>
            <Select
              value={officeId}
              label="Office"
              onChange={(e) => setOfficeId(e.target.value)}
              required
            >
              {offices.map(office => (
                <MenuItem key={office.id} value={office.id}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
