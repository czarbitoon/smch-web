// ResolveReport.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function ResolveReport() {
  const [id, setId] = useState('');

  const handleResolveReport = (e) => {
    e.preventDefault();
    axios.post(`http://127.0.0.1:8000/api/reports/${id}/resolve`)
      .then((response) => {
        console.log(response.data);
        alert('Report resolved successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Resolve Report
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <form onSubmit={handleResolveReport}>
          <TextField
            label="Report ID"
            type="number"
            fullWidth
            margin="normal"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Resolve Report
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default ResolveReport;