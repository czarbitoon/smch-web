// AddOffice.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function AddOffice() {
  const [name, setName] = useState('');

  const handleAddOffice = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/offices', {
      name: name,
    })
      .then((response) => {
        console.log(response.data);
        alert('Office added successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Office
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <form onSubmit={handleAddOffice}>
          <TextField
            label="Office Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Office
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddOffice;