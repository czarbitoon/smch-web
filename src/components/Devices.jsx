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
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import AddDevice from './AddDevice';
import AddReport from './AddReport';
import { AuthContext } from '../context/AuthProvider';
import axios from '../axiosInstance';

// Helper to get full image URL from storage path (aligned with mobile)
const getDeviceImageUrl = (imgPath) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/?api\/?$/, '') || 'http://localhost:8000';
  if (!imgPath || imgPath === 'default.png' || imgPath === 'default_device.jpg') {
    return `${apiBase}/storage/devices/default.png`;
  }
  if (/^https?:\/\//i.test(imgPath)) {
    return imgPath.replace(/^https:\/\/localhost:8000/i, 'http://localhost:8000');
  }
  let cleanPath = imgPath.replace(/^\/+/, '');
  cleanPath = cleanPath.replace(/^devices\/?/, '');
  return `${apiBase}/storage/${cleanPath}`;
};

// DeviceCard component for modularity
function DeviceCard({ device, isAdmin, isStaff, onReport, onEdit }) {
  return (
    <Paper
      elevation={0}
      onClick={() => onReport(device)}
      sx={{
        p: 2.5,
        borderRadius: 3,
        cursor: 'pointer',
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
          borderColor: '#1976d2'
        }
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160, backgroundColor: '#f5f5f5', borderRadius: 2.5, overflow: 'hidden' }}>
        <img
          src={getDeviceImageUrl(device.image_url || device.image)}
          alt={device.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = getDeviceImageUrl('default.png');
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1976d2', mb: 0.5, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{device.name}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#888', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{device.type?.name || 'Unknown Type'}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize', color: device.status === 'active' ? '#4caf50' : device.status === 'maintenance' ? '#ff9800' : '#f44336', mb: 1 }}>{device.status || 'Unknown'}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#1976d2', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{device.office?.name || 'Unknown Office'}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Button variant="contained" size="small" fullWidth onClick={e => { e.stopPropagation(); onReport(device); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>Report Issue</Button>
        {(isAdmin || isStaff) && (
          <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); onEdit(device); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', minWidth: 'auto', px: 1.5 }}>Edit</Button>
        )}
      </Box>
    </Paper>
  );
}

const Devices = () => {
  const theme = useTheme();
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
  const isUser = !isAdmin && !isStaff;
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Set default office for users and staff
  useEffect(() => {
    if ((isUser || isStaff) && user && user.office_id) {
      setFilterOffice(user.office_id);
    }
  }, [user, isUser, isStaff]);

  // Handle device card click to open report form
  const handleDeviceCardClick = (device) => {
    setSelectedDevice(device);
    setIsReportDialogOpen(true);
  };

  const handleDeviceAdded = (newDevice) => {
    fetchDevices();
  };
  const [categories, setCategories] = useState([]);
  const [editTypes, setEditTypes] = useState([]);
  const handleEditClick = (device) => {
    setEditDevice(device);
    setEditFormData({
      name: device.name,
      description: device.description || '',
      office_id: device.office?.id || '',
      category_id: device.category?.id || '',
      type_id: device.type?.id || '',
      status: device.status || ''
    });
    // Fetch types for the selected category
    if (device.category?.id) {
      axios.get(`/api/device-categories/${device.category.id}/types`).then(res => {
        if (res.data && Array.isArray(res.data.data?.types)) {
          setEditTypes(res.data.data.types);
        } else if (Array.isArray(res.data.types)) {
          setEditTypes(res.data.types);
        } else {
          setEditTypes([]);
        }
      }).catch(() => setEditTypes([]));
    } else {
      setEditTypes([]);
    }
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
      setError('');
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
      
      // Handle different response formats
      let deviceData = [];
      let totalCount = 0;
      let currentPage = 1;
      
      if (response.data) {
        if (response.data.success && response.data.data) {
          // Laravel paginated response format
          if (response.data.data.data && Array.isArray(response.data.data.data)) {
            deviceData = response.data.data.data;
            totalCount = response.data.data.total || 0;
            currentPage = response.data.data.current_page || 1;
          } else if (Array.isArray(response.data.data)) {
            // Simple array format
            deviceData = response.data.data;
            totalCount = deviceData.length;
          }
        } else if (Array.isArray(response.data)) {
          // Direct array response
          deviceData = response.data;
          totalCount = deviceData.length;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Nested data array
          deviceData = response.data.data;
          totalCount = deviceData.length;
        }
      }
      
      console.log('[Devices] Processed device data:', deviceData);
      console.log('[Devices] Total count:', totalCount);
      
      setDevices(deviceData);
      setTotalItems(totalCount);
      setPage(currentPage);
      
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
    <Container 
      maxWidth="lg" 
      sx={{ 
        bgcolor: theme.palette.background.default,
        py: theme.customSpacing.xl,
        minHeight: '100vh'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            mb: theme.customSpacing.lg,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Devices Management
        </Typography>
        <Box sx={{ 
          mb: theme.customSpacing.lg, 
          display: 'flex', 
          gap: theme.customSpacing.md,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="decommissioned">Decommissioned</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel>Office</InputLabel>
              <Select
                value={filterOffice}
                label="Office"
                onChange={e => { setFilterOffice(e.target.value); setPage(1); }}
              >
                <MenuItem value="all">All</MenuItem>
                {offices.map(office => (
                  <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
  {/* Devices Grid - Following mobile app pagination approach */}
        <Grid container spacing={2}>
          {Array.isArray(devices) && devices.length > 0 ? (
            devices
              .filter(device => filterStatus === 'all' || device.status === filterStatus)
              .filter(device => filterOffice === 'all' || String(device.office_id) === String(filterOffice))
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map(device => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={device.id}>
                    <DeviceCard
                      device={device}
                      isAdmin={isAdmin}
                      isStaff={isStaff}
                      onReport={device => {
                        setSelectedDevice(device);
                        setIsReportDialogOpen(true);
                      }}
                      onEdit={handleEditClick}
                    />
                  </Grid>
                );
              })
          ) : loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" sx={{ py: 4 }}>
                {error ? 'Error loading devices' : 'No devices found'}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Pagination - Following mobile app approach */}
        {Array.isArray(devices) && devices.length > rowsPerPage && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(
                devices
                  .filter(device => filterStatus === 'all' || device.status === filterStatus)
                  .filter(device => filterOffice === 'all' || String(device.office_id) === String(filterOffice))
                  .length / rowsPerPage
              )}
              page={page}
              onChange={(event, newPage) => setPage(newPage)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
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
  <InputLabel>Category</InputLabel>
  <Select
    value={editFormData.category_id || ''}
    label="Category"
    onChange={async (e) => {
      const categoryId = e.target.value;
      setEditFormData({ ...editFormData, category_id: categoryId, type_id: '' });
      // Fetch types for the selected category
      try {
        const res = await axios.get(`/api/device-categories/${categoryId}/types`);
        if (res.data && Array.isArray(res.data.data?.types)) {
          setEditTypes(res.data.data.types);
        } else if (Array.isArray(res.data.types)) {
          setEditTypes(res.data.types);
        } else {
          setEditTypes([]);
        }
      } catch {
        setEditTypes([]);
      }
    }}
  >
    {categories && categories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
{editFormData.category_id && (
  <FormControl fullWidth margin="normal" required>
    <InputLabel>Type</InputLabel>
    <Select
      value={editFormData.type_id || ''}
      label="Type"
      onChange={(e) => setEditFormData({ ...editFormData, type_id: e.target.value })}
    >
      {editTypes && editTypes.map((type) => (
        <MenuItem key={type.id} value={type.id}>
          {type.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
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


