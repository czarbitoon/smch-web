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
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddDevice from './AddDevice';
import { AuthContext } from '../context/AuthProvider';
import axios from '../axiosInstance';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [issueDescription, setIssueDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOffice, setFilterOffice] = useState('all');
  const [offices, setOffices] = useState([]);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const { user } = useContext(AuthContext);
  
  const isAdmin = user?.type === 2 || user?.type === 3;
  const isStaff = user?.type === 1;
  
  const handleDeviceAdded = (newDevice) => {
    fetchDevices();
  };

  useEffect(() => {
    fetchDevices();
    if (isAdmin || isStaff) {
      fetchOffices();
    }
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, [filterStatus, filterOffice]);
  const fetchOffices = async () => {
    try {
      const response = await axios.get('/offices');
      setOffices(response.data);
    } catch (error) {
      setError('Error fetching offices: ' + (error.response?.data?.message || error.message));
    }
  };
  const fetchDevices = async () => {
    try {
      setLoading(true);
      let url = '/devices';
      const params = new URLSearchParams();
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      if (!isAdmin && !isStaff) {
        // Regular users can only see devices in their office
        params.append('office_id', user.office_id);
      } else if (filterOffice !== 'all') {
        params.append('office_id', filterOffice);
      }

      const response = await axios.get(url, { params });
      setDevices(response.data);
    } catch (error) {
      setError('Error fetching devices: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  const logIssue = async (deviceId) => {
    if (!issueDescription.trim()) {
      setError('Please enter an issue description');
      return;
    }

    try {
      await axios.post(`/devices/${deviceId}/issues`, {
        description: issueDescription
      });
      setSelectedDevice(null);
      setIssueDescription('');
      fetchDevices(); // Refresh the devices list
    } catch (error) {
      setError('Error logging issue: ' + (error.response?.data?.message || error.message));
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
          {devices.map(device => (
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
                  Type: {device.type || 'N/A'}
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
                      href={`/devices/${device.id}/edit`}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
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
    </Container>
  );
};
export default Devices;


