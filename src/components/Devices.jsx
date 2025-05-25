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
  DialogActions,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddDevice from './AddDevice';
import AddReport from './AddReport';
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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    office_id: '',
    status: ''
  });
  const { user, userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Handle device card click to open report form
  const handleDeviceCardClick = (device) => {
    setSelectedDevice(device);
    setIsReportDialogOpen(true);
  };

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
      await axios.put(`/api/devices/${editDevice.id}`, editFormData);
      setSnackbar({
        open: true,
        message: 'Device updated successfully',
        severity: 'success'
      });
      fetchDevices();
      handleEditClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating device: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filter parameters
      if (filterStatus && filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      // Handle office filtering based on user role
      if (user && !isAdmin && !isStaff && user.office_id) {
        params.append('office_id', user.office_id);
      } else if (filterOffice && filterOffice !== 'all') {
        params.append('office_id', filterOffice);
      }
      
      // Add pagination parameters
      params.append('page', Math.max(1, page));
      params.append('per_page', Math.max(1, rowsPerPage));
      
      console.log('[Devices] Fetching devices with params:', Object.fromEntries(params));
      const response = await axios.get('/api/devices', { params });
      console.log('[Devices] API Response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        // Extract data and pagination info from response
        const deviceData = response.data.data.data || [];
        console.log('[Devices] Device data:', deviceData);
        console.log('[Devices] First device details:', deviceData[0]);
        const pagination = response.data.data;
        setDevices(deviceData);
        setTotalItems(pagination.total || 0);
        setPage(pagination.current_page || 1);
        setError('');
      } else {
        throw new Error(response.data?.message || 'Invalid response format');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('[Devices] Fetch error:', errorMessage);
      setError('Error fetching devices: ' + errorMessage);
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
      const response = await axios.get('/api/offices');
      if (response.data?.success && Array.isArray(response.data?.data)) {
        setOffices(response.data.data);
      } else if (response.data?.data?.offices && Array.isArray(response.data.data.offices)) {
        setOffices(response.data.data.offices);
      } else if (Array.isArray(response.data)) {
        setOffices(response.data);
      } else {
        console.error('[Devices] Invalid offices data format:', response.data);
        setOffices([]);
        setError('Invalid offices data format');
      }
    } catch (error) {
      console.error('[Devices] Error fetching offices:', error);
      setOffices([]);
      setError('Error fetching offices: ' + (error.response?.data?.message || error.message));
    }
  };
  const logIssue = async (deviceId) => {
    if (!issueDescription.trim()) {
      setError('Please enter an issue description');
      return;
    }

    try {
      await axios.post('/api/reports', {
        title: `Device Issue Report - Device ID: ${deviceId}`,
        description: issueDescription,
        device_id: deviceId,
        status: 'pending'
      });

      setSnackbar({
        open: true,
        message: 'Report submitted successfully',
        severity: 'success'
      });
      
      // Clear the form and selected device
      setIssueDescription('');
      setSelectedDevice(null);
      
      // Refresh the devices list
      fetchDevices();
    } catch (error) {
      setError('Error submitting report: ' + (error.response?.data?.message || error.message));
    }
  };
  const getDeviceStatus = async (deviceId) => {
    try {
      const response = await axios.get(`/api/devices/${deviceId}/status`);
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ bgcolor: 'white' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ bgcolor: 'white', py: 4 }}>
      <Box sx={{ position: 'relative', bgcolor: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Devices Management
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, bgcolor: 'white' }}>
          <FormControl sx={{ minWidth: 200, bgcolor: 'white' }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Devices</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
          
          {(isAdmin || isStaff) && (
            <FormControl sx={{ minWidth: 200, bgcolor: 'white' }}>
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
                <Paper 
                  elevation={3} 
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {/* Device Image */}
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
                    {device.image_url ? (
                      <img
                        src={device.image_url.startsWith('/images/') ? `http://127.0.0.1:8000${device.image_url}` : device.image_url}
                        alt={device.name}
                        style={{ width: '100%', maxHeight: 100, objectFit: 'cover', borderRadius: 8 }}
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                      />
                    ) : (
                      <img
                        src={'https://via.placeholder.com/400x200?text=No+Image'}
                        alt="No Image"
                        style={{ width: '100%', maxHeight: 100, objectFit: 'cover', borderRadius: 8 }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {device.name}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={device.status === 'maintenance' ? 'Maintenance' : 
                             device.status === 'active' ? 'Active' : 
                             device.status === 'inactive' ? 'Inactive' : device.status} 
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          setSelectedDevice(device);
                        }}
                      >
                        Log Issue
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        getDeviceStatus(device.id);
                      }}
                    >
                      Refresh Status
                    </Button>
                    {(isAdmin || isStaff) && (
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          handleEditClick(device);
                        }}
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
            count={parseInt(Math.max(1, Math.ceil(totalItems / rowsPerPage))) || 1}
            page={parseInt(Math.min(page, Math.max(1, Math.ceil(totalItems / rowsPerPage)))) || 1}
            onChange={(event, newPage) => setPage(parseInt(newPage))}
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

      {/* Report Dialog */}
      <AddReport
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        preselectedDeviceId={selectedDevice ? selectedDevice.id : ''}
        onSuccess={() => {
          setIsReportDialogOpen(false);
          setSnackbar({
            open: true,
            message: 'Report submitted successfully',
            severity: 'success'
          });
        }}
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
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for success/error messages */}
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
};

export default Devices;


