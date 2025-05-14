import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Box, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { reportService } from '../services/api';
import axios from '../axiosInstance';

function AddReport({ open, onClose, onSuccess, preselectedDeviceId }) {
  const [description, setDescription] = useState('');
  const [deviceId, setDeviceId] = useState(preselectedDeviceId || '');
  const [devices, setDevices] = useState([]);
  const [reportImage, setReportImage] = useState(null);
  const [reportImagePreview, setReportImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      fetchDevices();
      if (preselectedDeviceId) {
        setDeviceId(preselectedDeviceId);
      }
    }
  }, [open, preselectedDeviceId]);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/api/devices');
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



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setReportImage(null);
    setReportImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      const formData = new FormData();
      formData.append('title', `Issue Report - ${selectedDevice?.name || 'Device'}`);
      formData.append('description', description);
      formData.append('device_id', deviceId);
      formData.append('status', 'pending');
      
      // Add the image if one was selected
      if (reportImage) {
        // Upload image to new backend endpoint first
        const imgForm = new FormData();
        imgForm.append('image', reportImage);
        imgForm.append('folder', 'report_images');
        const imgRes = await axios.post('/api/images/upload', imgForm, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (imgRes.data && imgRes.data.path) {
          formData.append('report_image', imgRes.data.path);
        }
      }

      // Set the authorization header for the reportService
      const response = await axios.post('/reports', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
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
    setReportImage(null);
    setReportImagePreview('');
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
              
              {/* Image Upload Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Image (Optional)
                </Typography>
                
                {reportImagePreview ? (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <img 
                      src={reportImagePreview} 
                      alt="Report preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }} 
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                      }}
                      onClick={handleRemoveImage}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{ mt: 1 }}
                  >
                    Upload Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Button>
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
