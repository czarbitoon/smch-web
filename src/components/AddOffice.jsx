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
      const response = await axios.post('/api/offices', {
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
        <DialogTitle sx={{ pb: 2, typography: 'h5' }}>Add New Office</DialogTitle>
        <form onSubmit={handleAddOffice}>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Office Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
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