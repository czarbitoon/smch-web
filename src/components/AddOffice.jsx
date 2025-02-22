// AddOffice.jsx

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, TextField, Button } from '@mui/material';
import axios from '../axiosInstance';

function AddOffice({ open, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddOffice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/offices', {
        name: name,
      });
      setSnackbar({
        open: true,
        message: 'Office added successfully!',
        severity: 'success'
      });
      onSuccess && onSuccess(response.data);
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding office: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    setName('');
    onClose && onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Office</DialogTitle>
        <form onSubmit={handleAddOffice}>
          <DialogContent>
            <TextField
              label="Office Name"
              type="text"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Office
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

export default AddOffice;