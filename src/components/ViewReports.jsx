// src\components\ViewReports.jsx

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function ViewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reports')
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        View Reports
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <List>
          {reports.map((report) => (
            <ListItem key={report.id}>
              <ListItemText primary={report.title} secondary={report.description} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default ViewReports;