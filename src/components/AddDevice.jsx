// src\components\AddDevice.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Container, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from '../axiosInstance';

function AddDevice({ open, onClose, onSuccess, isStandalone = false }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [offices, setOffices] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const response = await axios.get('/offices');
      setOffices(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching offices: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/devices', {
        name: name,
        description: description,
        office_id: officeId,
      });
      setSnackbar({
        open: true,
        message: 'Device added successfully!',
        severity: 'success'
      });
      onSuccess && onSuccess(response.data);
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding device: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setOfficeId('');
    onClose && onClose();
  };

  const formContent = (
    <>
      <TextField
        label="Device Name"
        type="text"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Device Description"
        type="text"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
        rows={3}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Office</InputLabel>
        <Select
          value={officeId}
          label="Office"
          onChange={(e) => setOfficeId(e.target.value)}
        >
          {offices.map((office) => (
            <MenuItem key={office.id} value={office.id}>
              {office.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
  

  if (isStandalone) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Device
          </Typography>
          <form onSubmit={handleAddDevice}>
            {formContent}
            <Box sx={{ mt: 2 }}>
              <Button onClick={() => window.history.back()} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add Device
              </Button>
            </Box>
          </form>
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

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Device</DialogTitle>
        <form onSubmit={handleAddDevice}>
          <DialogContent>
            {formContent}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Device
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

export default AddDevice;


