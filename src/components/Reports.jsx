// src/components/Reports.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch reports from the API
    axios.get('http://127.0.0.1:8000/api/reports')
      .then(response => setReports(response.data))
      .catch(error => console.error('Error fetching reports:', error));
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <List>
          {reports.map(report => (
            <ListItem key={report.id}>
              <ListItemText
                primary={report.title}
                secondary={`Generated on: ${new Date(report.date).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Reports;