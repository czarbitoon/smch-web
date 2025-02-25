import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Box, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { reportService } from '../services/api';
import axios from '../axiosInstance';

function AddReport({ open, onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [devices, setDevices] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      fetchDevices();
    }
  }, [open]);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/devices');
      // Ensure we always set an array, even if the response is empty or malformed
      setDevices(Array.isArray(response.data) ? response.data : (response.data?.data || []));
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]); // Set empty array on error
      setSnackbar({
        open: true,
        message: 'Error fetching devices: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId) {
      setSnackbar({
        open: true,
        message: 'Please select a device',
        severity: 'error'
      });
      return;
    }

    try {
      const selectedDevice = devices.find(d => d.id === deviceId);
      const reportData = {
        title: `Issue Report - ${selectedDevice?.name || 'Device'}`,
        description,
        device_id: deviceId,
        status: 'pending'
      };

      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Please log in to submit a report',
          severity: 'error'
        });
        return;
      }

      // Set the authorization header for the reportService
      const response = await axios.post('/reports', reportData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSnackbar({
        open: true,
        message: 'Report submitted successfully!',
        severity: 'success'
      });
      onSuccess && onSuccess(response.data);
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error === 'User not authenticated' 
        ? 'Please log in to submit a report' 
        : error.response?.data?.error || error.response?.data?.message || 'Error submitting report';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      console.error('Report submission error:', error.response?.data || error);
    }
  };

  const handleClose = () => {
    setDescription('');
    setDeviceId('');
    onClose && onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, typography: 'h5' }}>Submit Report</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={3}>
              <FormControl fullWidth required variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}>
                <InputLabel>Device</InputLabel>
                <Select
                  value={deviceId}
                  label="Device"
                  onChange={(e) => setDeviceId(e.target.value)}
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Describe the Issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                placeholder="Please provide details about the issue you're experiencing with this device"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                borderRadius: 1.5
              }}
            >
              Submit Report
            </Button>
          </DialogActions>
        </form>
      </Dialog>
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
    </>
  );
}

export default AddReport;
