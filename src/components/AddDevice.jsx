// src\components\AddDevice.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Container, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
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
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
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
      const response = await axios.get('/device-categories');
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
      const response = await axios.get(`/device-categories/${categoryId}/types`);
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
      const response = await axios.get(`/device-types/${typeId}/subcategories`);
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
      const response = await axios.get('/offices');
      if (response.data?.success && Array.isArray(response.data.data)) {
        setOffices(response.data.data);
      } else if (response.data?.data?.offices) {
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

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/devices', {
        name: name,
        description: description,
        office_id: officeId,
        category_id: selectedCategory,
        type_id: selectedType,
        subcategory_id: selectedSubcategory
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


