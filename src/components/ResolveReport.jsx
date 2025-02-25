// src\components\ResolveReport.jsx

import React, { useState, useContext } from 'react';
import { Container, Typography, Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../axiosInstance';

function ResolveReport() {
  const { user } = useContext(AuthContext);
  const [id, setId] = useState('');
  const [report, setReport] = useState({});
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleResolveReport = (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide resolution notes',
        severity: 'error'
      });
      return;
    }
    axiosInstance.post(`/reports/${id}/resolve`, { resolution_notes: resolutionNotes })
      .then((response) => {
        setSnackbar({
          open: true,
          message: 'Report resolved successfully!',
          severity: 'success'
        });
        setReport({ ...report, resolved_by: user.id });
      })
      .catch((error) => {
        console.error('Error resolving report:', error.response?.data || error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Error resolving report',
          severity: 'error'
        });
      });
  };

  const handleGetReport = (e) => {
    e.preventDefault();
    axiosInstance.get(`/reports/${id}`)
      .then((response) => {
        setReport(response.data);
        setResolutionNotes('');
      })
      .catch((error) => {
        console.error('Error fetching report:', error.response?.data || error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Error fetching report',
          severity: 'error'
        });
      });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Resolve Report
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        {report.id && (
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
            <Typography variant="body1" component="p" gutterBottom>
              Reported by: {report.user?.name || 'Unknown'}
            </Typography>
            {report.resolved_by ? (
              <Typography variant="body1" component="p" gutterBottom>
                Resolved by: {report.resolved_by_user?.name || 'Unknown'}
              </Typography>
            ) : (
              <form onSubmit={handleResolveReport}>
                <TextField
                  label="Resolution Notes"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  required
                />
                <Button type="submit" variant="contained" color="primary">
                  Resolve Report
                </Button>
              </form>
            )}
          </div>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ResolveReport;
