import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Box, TextField, Button, Stack } from '@mui/material';
import { reportService } from '../services/api';

function AddReport({ open, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await reportService.addReport(formData);
      setSnackbar({
        open: true,
        message: 'Report submitted successfully!',
        severity: 'success'
      });
      onSuccess && onSuccess(response);
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting report: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
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
              <TextField
                required
                fullWidth
                label="Report Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="report-image"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="report-image">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      borderRadius: 1.5,
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Upload Image
                  </Button>
                </label>
                {imagePreview && (
                  <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </Box>
                )}
              </Box>
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
