import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Box, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, Autocomplete, TextField as AutocompleteTextField } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { reportService } from '../services/api';
import axios from '../axiosInstance';

function AddReport({ open, onClose, onSuccess, preselectedDeviceId }) {
  const [description, setDescription] = useState('');
  const [deviceId, setDeviceId] = useState(preselectedDeviceId || '');
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [reportImage, setReportImage] = useState(null);
  const [reportImagePreview, setReportImagePreview] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      setLoadingDevices(true);
      fetchDevices();
      setDeviceId(preselectedDeviceId || '');
      setSelectedDevice(null); // Always reset, will set after devices load
    }
  }, [open, preselectedDeviceId]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/api/devices');
      console.log('Devices API Response:', response.data);
      let deviceList = [];
      if (Array.isArray(response.data)) {
        deviceList = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        deviceList = response.data.data;
      } else if (response.data?.devices && Array.isArray(response.data.devices)) {
        deviceList = response.data.devices;
      } else {
        console.warn('Unexpected API response format:', response.data);
      }
      setDevices(deviceList);
      if (preselectedDeviceId) {
        const device = deviceList.find(d => d.id === preselectedDeviceId);
        setSelectedDevice(device || null);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
      setSnackbar({
        open: true,
        message: 'Error fetching devices: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setLoadingDevices(false);
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
      const selectedDevice = devices.find(d => d.id === deviceId) || { name: 'Unknown Device' };
      const formData = new FormData();
      formData.append('title', `Issue Report - ${selectedDevice.name}`);
      formData.append('description', description);
      formData.append('device_id', deviceId);
      formData.append('status', 'pending');
      
      if (reportImage) {
        const imgForm = new FormData();
        imgForm.append('image', reportImage);
        imgForm.append('folder', 'report_images');
        const imgRes = await axios.post('/api/images/upload', imgForm, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (imgRes.data && imgRes.data.path) {
          formData.append('report_image', imgRes.data.path);
        }
      }

      const token = localStorage.getItem('token');
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
    setSelectedDevice(null);
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
              {/* Device Field */}
              {loadingDevices ? (
                <TextField
                  label="Device"
                  value="Loading devices..."
                  InputProps={{ readOnly: true }}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
              ) : preselectedDeviceId ? (
                <TextField
                  label="Device"
                  value={
                    selectedDevice?.name ||
                    (devices.length === 0
                      ? 'No devices found'
                      : 'Device not found (ID: ' + preselectedDeviceId + ')')
                  }
                  InputProps={{ readOnly: true }}
                  fullWidth
                  required
                  error={!selectedDevice}
                  helperText={
                    !selectedDevice && devices.length > 0
                      ? 'The selected device was not found. Please contact support.'
                      : ''
                  }
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
              ) : (
                <Autocomplete
                  options={devices}
                  getOptionLabel={(option) => option.name || ''}
                  value={devices.find(d => d.id === deviceId) || null}
                  onChange={(e, newValue) => setDeviceId(newValue?.id || '')}
                  renderInput={(params) => (
                    <AutocompleteTextField
                      {...params}
                      label="Device"
                      variant="outlined"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                  )}
                  disabled={loadingDevices}
                  loading={loadingDevices}
                />
              )}
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