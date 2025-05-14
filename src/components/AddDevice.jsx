// src\components\AddDevice.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Container, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Stack, IconButton, CircularProgress } from '@mui/material';
import { PhotoCamera, Close, AddPhotoAlternate } from '@mui/icons-material';
import axios from '../axiosInstance';

function AddDevice({ open, onClose, onSuccess, isStandalone = false }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [offices, setOffices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  // Removed: const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [deviceImage, setDeviceImage] = useState(null);
  const [deviceImagePreview, setDeviceImagePreview] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOffices();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchTypes(selectedCategory);
    } else {
      setTypes([]);
      setSelectedType('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedType) {
      fetchSubcategories(selectedType);
    } else {
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedType]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/device-categories');
      console.log('[AddDevice] Categories API Response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('[AddDevice] Error fetching categories:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: 'Error fetching categories: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const fetchTypes = async (categoryId) => {
    try {
      console.log('[AddDevice] Fetching types for category:', categoryId);
      const response = await axios.get(`/api/device-categories/${categoryId}/types`);
      console.log('[AddDevice] Types API Response:', response.data);
      setTypes(response.data);
    } catch (error) {
      console.error('[AddDevice] Error fetching types:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: 'Error fetching types: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const fetchSubcategories = async (typeId) => {
    try {
      console.log('[AddDevice] Fetching subcategories for type:', typeId);
      const response = await axios.get(`/api/device-categories/${selectedCategoryId}/types/${typeId}/subcategories`);
      console.log('[AddDevice] Subcategories API Response:', response.data);
      setSubcategories(response.data);
    } catch (error) {
      console.error('[AddDevice] Error fetching subcategories:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: 'Error fetching subcategories: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await axios.get('/api/offices');
      if (response.data?.success && Array.isArray(response.data.data)) {
        setOffices(response.data.data);
      } else if (response.data?.data?.offices && Array.isArray(response.data.data.offices)) {
        setOffices(response.data.data.offices);
      } else if (Array.isArray(response.data)) {
        setOffices(response.data);
      } else {
        console.error('[AddDevice] Invalid offices data format:', response.data);
        setOffices([]);
        setSnackbar({
          open: true,
          message: 'Error: Invalid office data received from server',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching offices: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
      setOffices([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Please upload a valid image file (JPEG, PNG, GIF)',
          severity: 'error'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size should be less than 5MB',
          severity: 'error'
        });
        return;
      }
      
      setImageLoading(true);
      setDeviceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDeviceImagePreview(reader.result);
        setImageLoading(false);
      };
      reader.onerror = () => {
        setSnackbar({
          open: true,
          message: 'Error loading image. Please try again.',
          severity: 'error'
        });
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setDeviceImage(null);
    setDeviceImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('office_id', officeId);
      formData.append('category_id', selectedCategory);
      formData.append('type_id', selectedType);
      formData.append('subcategory_id', selectedSubcategory);
      
      // Add the image if one was selected
      if (deviceImage) {
        // Upload image to new backend endpoint first
        const imgForm = new FormData();
        imgForm.append('image', deviceImage);
        imgForm.append('folder', 'devices');
        const imgRes = await axios.post('/api/images/upload', imgForm, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (imgRes.data && imgRes.data.path) {
          formData.append('image', imgRes.data.path);
        }
      }

      const response = await axios.post('/api/devices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
    setSelectedCategory('');
    setSelectedType('');
    setSelectedSubcategory('');
    setDeviceImage(null);
    setDeviceImagePreview('');
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
      
      {/* Device Image Upload Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Device Image (Optional)
        </Typography>
        
        {deviceImagePreview ? (
          <Box sx={{ position: 'relative', mt: 1 }}>
            <img 
              src={deviceImagePreview} 
              alt="Device preview" 
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
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              onClick={handleRemoveImage}
              size="small"
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
            Upload Device Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </Button>
        )}
      </Box>
      
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCategory && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType}
            label="Type"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {selectedType && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={selectedSubcategory}
            label="Subcategory"
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
        <DialogTitle sx={{ pb: 2, typography: 'h5' }}>Add New Device</DialogTitle>
        <form onSubmit={handleAddDevice}>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Device Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <TextField
                label="Device Description"
                type="text"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                multiline
                rows={3}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
              <FormControl fullWidth required variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}>
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
              
              {/* Device Image Upload Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Device Image (Optional)
                </Typography>
                
                <Box sx={{ 
                  border: '2px dashed #ccc', 
                  borderRadius: 2, 
                  p: 2, 
                  mt: 1,
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9f9f9'
                }}>
                  {imageLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" color="text.secondary">
                        Processing image...
                      </Typography>
                    </Box>
                  ) : deviceImagePreview ? (
                    <Box sx={{ position: 'relative', width: '100%' }}>
                      <img 
                        src={deviceImagePreview} 
                        alt="Device preview" 
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
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)'
                          }
                        }}
                        onClick={handleRemoveImage}
                        size="small"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <AddPhotoAlternate sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Drag and drop an image here or
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera />}
                        sx={{ mt: 1 }}
                      >
                        Browse Files
                        <input
                          type="file"
                          hidden
                          accept="image/jpeg,image/png,image/gif,image/jpg"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                        />
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Supported formats: JPEG, PNG, GIF (max 5MB)
                      </Typography>
                    </>
                  )}
                </Box>
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


