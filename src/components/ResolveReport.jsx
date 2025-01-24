// src\components\ResolveReport.jsx

import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';

function ResolveReport() {
  const [id, setId] = useState('');
  const [report, setReport] = useState({});

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

  const handleGetReport = (e) => {
    e.preventDefault();
    axios.get(`http://127.0.0.1:8000/api/reports/${id}`)
      .then((response) => {
        setReport(response.data);
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
        <form onSubmit={handleGetReport}>
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
            Get Report
          </Button>
        </form>
        {report && (
          <div>
            <Typography variant="h6" component="h2" gutterBottom>
              Report Details
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Title: {report.title}
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Description: {report.description}
            </Typography>
            <form onSubmit={handleResolveReport}>
              <Button type="submit" variant="contained" color="primary">
                Resolve Report
              </Button>
            </form>
          </div>
        )}
      </Box>
    </Container>
  );
}

export default ResolveReport;