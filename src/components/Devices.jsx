import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Snackbar,
  Chip,
  Grid,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddDevice from './AddDevice';
import { AuthContext } from '../context/AuthProvider';
import axios from '../axiosInstance';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [issueDescription, setIssueDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOffice, setFilterOffice] = useState('all');
  const [offices, setOffices] = useState([]);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    office_id: '',
    status: ''
  });
  const { user, userType } = useContext(AuthContext);
  
  const isAdmin = Number(userType) >= 2;
  const isStaff = Number(userType) === 1;
  
  const handleDeviceAdded = (newDevice) => {
    fetchDevices();
  };

  const handleEditClick = (device) => {
    setEditDevice(device);
    setEditFormData({
      name: device.name,
      description: device.description || '',
      office_id: device.office?.id || '',
      status: device.status || ''
    });
    setIsEditDialogOpen(true);
  };
  const handleEditClose = () => {
    setEditDevice(null);
    setIsEditDialogOpen(false);
    setEditFormData({
      name: '',
      description: '',
      office_id: '',
      status: ''
    });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/devices/${editDevice.id}`, editFormData);
      fetchDevices();
      handleEditClose();
    } catch (error) {
      setError('Error updating device: ' + (error.response?.data?.message || error.message));
    }
  };
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      if (user && !isAdmin && !isStaff && user.office_id) {
        params.append('office_id', user.office_id);
      } else if (filterOffice !== 'all') {
        params.append('office_id', filterOffice);
      }

      // Add pagination parameters
      params.append('page', page);
      params.append('per_page', rowsPerPage);

      const response = await axios.get('/devices', { params });
      if (response.data) {
        // Handle both array and paginated response formats
        const deviceData = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const total = Array.isArray(response.data) ? deviceData.length : (response.data.total || deviceData.length);
        
        setDevices(deviceData);
        setTotalItems(total);
      } else {
        setDevices([]);
        setTotalItems(0);
      }
    } catch (error) {
      setError('Error fetching devices: ' + (error.response?.data?.message || error.message));
      setDevices([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setPage(1); // Reset page when filters change
      await fetchDevices();
      if (isAdmin || isStaff) {
        await fetchOffices();
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, [filterStatus, filterOffice, isAdmin, isStaff]); // Add proper dependencies
  useEffect(() => {
    fetchDevices();
  }, [page]); // Only trigger on page changes
  const fetchOffices = async () => {
    try {
      const response = await axios.get('/offices');
      setOffices(response.data);
    } catch (error) {
      setError('Error fetching offices: ' + (error.response?.data?.message || error.message));
    }
  };
  const logIssue = async (deviceId) => {
    if (!issueDescription.trim()) {
      setError('Please enter an issue description');
      return;
    }
  };
  const getDeviceStatus = async (deviceId) => {
    try {
      const response = await axios.get(`/devices/${deviceId}/status`);
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId ? { ...device, status: response.data.status } : device
        )
      );
    } catch (error) {
      setError('Error fetching device status: ' + (error.response?.data?.message || error.message));
    }
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ marginY: 4, position: 'relative' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Devices Management
        </Typography>
  {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Devices</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="maintenance">Under Maintenance</MenuItem>
            </Select>
          </FormControl>
          
          {(isAdmin || isStaff) && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Office</InputLabel>
              <Select
                value={filterOffice}
                label="Filter by Office"
                onChange={(e) => setFilterOffice(e.target.value)}
              >
                <MenuItem value="all">All Offices</MenuItem>
                {offices.map(office => (
                  <MenuItem key={office.id} value={office.id}>
                    {office.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
  {/* Issue Logging Form */}
        {selectedDevice && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Log Issue for {selectedDevice.name}
            </Typography>
            <TextField
              label="Issue Description"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={() => logIssue(selectedDevice.id)}
                sx={{ mr: 1 }}
              >
                Submit Issue
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedDevice(null)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
  {/* Devices Grid */}
        <Grid container spacing={3}>
          {devices && devices.length > 0 ? (
            devices.map(device => (
              <Grid item xs={12} sm={6} md={4} key={device.id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {device.name}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={device.status} 
                      color={
                        device.status === 'active' ? 'success' :
                        device.status === 'maintenance' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ID: {device.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Category: {device.category?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Type: {device.type?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Subcategory: {device.subcategory?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Office: {device.office?.name || 'N/A'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {!selectedDevice && (
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => setSelectedDevice(device)}
                      >
                        Log Issue
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => getDeviceStatus(device.id)}
                    >
                      Refresh Status
                    </Button>
                    {(isAdmin || isStaff) && (
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        size="small"
                        onClick={() => handleEditClick(device)}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                No devices found
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.max(1, Math.ceil(totalItems / rowsPerPage))}
            page={Math.min(page, Math.max(1, Math.ceil(totalItems / rowsPerPage)))}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
      
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />

      {(isAdmin || isStaff) && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsAddDeviceOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <AddDevice
        open={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onSuccess={handleDeviceAdded}
      />

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Device</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              label="Device Name"
              fullWidth
              margin="normal"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              multiline
              rows={3}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Office</InputLabel>
              <Select
                value={editFormData.office_id}
                label="Office"
                onChange={(e) => setEditFormData({ ...editFormData, office_id: e.target.value })}
              >
                {offices.map(office => (
                  <MenuItem key={office.id} value={office.id}>
                    {office.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={editFormData.status}
                label="Status"
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Devices;


