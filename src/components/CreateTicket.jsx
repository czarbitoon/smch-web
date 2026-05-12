import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Box, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import axios from '../axiosInstance';

function CreateTicket({ open, onClose, onSuccess, preselectedDeviceId, preselectedDeviceName }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deviceId, setDeviceId] = useState(preselectedDeviceId || '');
  const [priority, setPriority] = useState('medium');
  const [ticketImage, setTicketImage] = useState(null);
  const [ticketImagePreview, setTicketImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setDeviceId(preselectedDeviceId || '');
      setSubject('');
      setDescription('');
      setPriority('medium');
      setTicketImage(null);
      setTicketImagePreview('');
      setIsSubmitting(false);
    }
  }, [open, preselectedDeviceId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTicketImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setTicketImage(null);
    setTicketImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!deviceId) {
      setSnackbar({
        open: true,
        message: 'Please select a device',
        severity: 'error'
      });
      return;
    }

    if (!subject.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a ticket subject',
        severity: 'error'
      });
      return;
    }

    if (!description.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a description',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('device_id', deviceId);
      formData.append('priority', priority);
      
      if (ticketImage) {
        formData.append('image', ticketImage);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('/tickets', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbar({
        open: true,
        message: 'Ticket created successfully!',
        severity: 'success'
      });
      
      onSuccess && onSuccess(response.data);
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error === 'User not authenticated' 
        ? 'Please log in to create a ticket' 
        : error.response?.data?.error || error.response?.data?.message || 'Error creating ticket';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      console.error('Ticket creation error:', error.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setDescription('');
    setDeviceId('');
    setPriority('medium');
    setTicketImage(null);
    setTicketImagePreview('');
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
        <DialogTitle sx={{ pb: 2, typography: 'h5' }}>Create Support Ticket</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={3}>
              {/* Device Field (Read-only if preselected) */}
              <TextField
                label="Device"
                value={preselectedDeviceName || 'Select a device'}
                InputProps={{ readOnly: !!preselectedDeviceName }}
                fullWidth
                required
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />

              {/* Subject Field */}
              <TextField
                required
                fullWidth
                label="Ticket Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                placeholder="Brief summary of the issue"
              />

              {/* Description Field */}
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
                placeholder="Provide detailed information about the issue"
              />

              {/* Priority Field */}
              <FormControl fullWidth required>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                  sx={{ borderRadius: 1.5 }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              {/* Image Upload Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Image (Optional)
                </Typography>
                
                {ticketImagePreview ? (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <img 
                      src={ticketImagePreview} 
                      alt="Ticket preview" 
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                borderRadius: 1.5
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

export default CreateTicket;
