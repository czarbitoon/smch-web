import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Snackbar,
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

// Helper to get full image URL from storage path
const getDeviceImageUrl = (imgPath) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/?api\/?$/, '') || 'http://localhost:8000';
  if (!imgPath || imgPath === 'default.png' || imgPath === 'default_device.jpg') {
    return `${apiBase}/storage/devices/default.png`;
  }
  if (/^https?:\/\//i.test(imgPath)) {
    return imgPath.replace(/^https:\/\/localhost:8000/i, 'http://localhost:8000');
  }
  return `${apiBase}/storage/${imgPath.replace(/^\/*(devices\/)?/, '')}`;
};

// Helper to get device type name robustly
const getDeviceTypeName = (device, types, categories) => {
  let typeId = device.device_type_id?.toString() || device.type?.id?.toString();
  let foundType = types.find(t => t.id?.toString() === typeId);
  if (foundType) return foundType.name;
  if (Array.isArray(categories)) {
    for (const cat of categories) {
      if (Array.isArray(cat.types)) {
        const t = cat.types.find(tt => tt.id?.toString() === typeId);
        if (t) return t.name;
      }
    }
  }
  if (device.type && device.type.name) return device.type.name;
  return 'Unknown Type';
};

const getOfficeName = (device, offices) => {
  const officeId = device.office?.id?.toString() || device.office_id?.toString();
  const found = offices.find(o => o.id?.toString() === officeId);
  if (found) return found.name;
  if (device.office && device.office.name) return device.office.name;
  return 'Unknown Office';
};

// DeviceCard component
function DeviceCard({ device, isAdmin, isStaff, onReport, onEdit, types, categories, offices }) {
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
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getDeviceImageUrl('default.png');
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1976d2', mb: 0.5, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{device.name}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#888', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{getDeviceTypeName(device, types, categories)}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize', color: device.status === 'active' ? '#4caf50' : device.status === 'maintenance' ? '#ff9800' : '#f44336', mb: 1 }}>{device.status || 'Unknown'}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#1976d2', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{getOfficeName(device, offices)}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Button variant="contained" size="small" fullWidth onClick={(e) => { e.stopPropagation(); onReport(device); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>Report Issue</Button>
        {(isAdmin || isStaff) && (
          <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); onEdit(device); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', minWidth: 'auto', px: 1.5 }}>Edit</Button>
        )}
      </Box>
    </Paper>
  );
}

const Devices = () => {
  const theme = useTheme();
  const { user, userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isStaff = userRole === 'staff';
  const isUser = !isAdmin && !isStaff;

  // State declarations
  const [devices, setDevices] = useState([]);
  const [rowsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [issueDescription, setIssueDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOffice, setFilterOffice] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [offices, setOffices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [editTypes, setEditTypes] = useState([]);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    office_id: '',
    category_id: '',
    type_id: '',
    status: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [officesLoading, setOfficesLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(false);
  const [orderByCreated, setOrderByCreated] = useState('latest');

  // Log role and user data for debugging
  useEffect(() => {
    console.log('User Role:', userRole, 'User:', user);
  }, [userRole, user]);

  // Set default office for users and staff
  useEffect(() => {
    if ((isUser || isStaff) && user?.office_id) {
      setFilterOffice(user.office_id);
    }
  }, [user, isUser, isStaff]);

  // Fetch categories and offices on mount (offices for admin/superadmin/staff)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch categories
        const catRes = await axios.get('/api/device-categories');
        let cats = [];
        if (catRes.data && catRes.data.data && Array.isArray(catRes.data.data.categories)) {
          cats = catRes.data.data.categories;
        } else if (catRes.data && Array.isArray(catRes.data.categories)) {
          cats = catRes.data.categories;
        } else if (Array.isArray(catRes.data)) {
          cats = catRes.data;
        } else if (catRes.data && Array.isArray(catRes.data.data)) {
          cats = catRes.data.data;
        }
        setCategories(cats);
      } catch (e) {
        setCategories([]);
      }
      if (isAdmin || isStaff) {
        setOfficesLoading(true);
        try {
          const offRes = await axios.get('/api/offices');
          console.log('Offices API Response:', offRes.data); // Debug
          let officesArr = [];
          if (offRes.data && offRes.data.data && Array.isArray(offRes.data.data.offices)) {
            officesArr = offRes.data.data.offices;
          } else if (Array.isArray(offRes.data.offices)) {
            officesArr = offRes.data.offices;
          } else if (Array.isArray(offRes.data)) {
            officesArr = offRes.data;
          } else if (offRes.data && Array.isArray(offRes.data.data)) {
            officesArr = offRes.data.data;
          }
          setOffices(officesArr);
        } catch (e) {
          setOffices([]);
        } finally {
          setOfficesLoading(false);
        }
      }
    };
    fetchAll();
  }, [isAdmin, isStaff]);

  // Fetch types when category changes
  useEffect(() => {
    const fetchTypes = async () => {
      if (filterCategory !== 'all') {
        setTypesLoading(true);
        try {
          const res = await axios.get(`/api/device-categories/${filterCategory}/types`);
          let typesArr = [];
          if (res.data && res.data.data && Array.isArray(res.data.data.types)) {
            typesArr = res.data.data.types;
          } else if (Array.isArray(res.data.types)) {
            typesArr = res.data.types;
          } else if (Array.isArray(res.data)) {
            typesArr = res.data;
          }
          setTypes(typesArr);
        } catch (e) {
          setTypes([]);
        } finally {
          setTypesLoading(false);
        }
      } else {
        setTypes([]);
        setTypesLoading(false);
      }
      setFilterType('all');
      setPage(1);
    };
    fetchTypes();
  }, [filterCategory]);

  // Fetch devices
  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        per_page: rowsPerPage,
        order_by_created: orderByCreated
      };
      if (filterCategory !== 'all') params.device_category_id = filterCategory;
      if (filterType !== 'all') params.device_type_id = filterType;
      if (filterOffice !== 'all') params.office_id = filterOffice;
      if (filterStatus !== 'all') params.status = filterStatus;
      console.log('Fetch Devices Params:', params); // Debug API call
      const response = await axios.get('/api/devices', { params });
      console.log('Fetch Devices Response:', response.data); // Debug API response
      const deviceArray = Array.isArray(response.data?.data?.data) ? response.data.data.data :
                         Array.isArray(response.data?.data) ? response.data.data : [];
      const totalCount = response.data?.data?.total || deviceArray.length;
      const currentPage = response.data?.data?.current_page || 1;
      setDevices(deviceArray);
      setTotalItems(totalCount);
      setPage(currentPage);
    } catch (error) {
      setError(`Error fetching devices: ${error.response?.data?.message || error.message}`);
      setDevices([]);
      setTotalItems(0);
      console.error('Fetch Devices Error:', error); // Debug error
    } finally {
      setLoading(false);
    }
  };

  // Fetch offices for admin/staff
  const fetchOffices = async () => {
    if (isAdmin || isStaff) {
      setOfficesLoading(true);
      try {
        const response = await axios.get('/api/offices');
        setOffices(Array.isArray(response.data?.data) ? response.data.data :
                   Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(`Error fetching offices: ${error.response?.data?.message || error.message}`);
        setOffices([]);
        console.error('Fetch Offices Error:', error); // Debug error
      } finally {
        setOfficesLoading(false);
      }
    }
  };

  // Main data fetch effect
  useEffect(() => {
    fetchDevices();
    fetchOffices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterOffice, filterCategory, filterType, page]);

  // Handle edit device
  const handleEditClick = (device) => {
    setEditDevice(device);
    setEditFormData({
      name: device.name,
      description: device.description || '',
      office_id: device.office?.id || '',
      category_id: device.category?.id || 'all',
      type_id: device.type?.id || 'all',
      status: device.status || ''
    });
    
    if (device.category?.id) {
      axios.get(`/api/device-categories/${device.category.id}/types`).then(res => {
        setEditTypes(Array.isArray(res.data?.data?.types) ? res.data.data.types :
                     Array.isArray(res.data?.types) ? res.data.types : []);
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
      category_id: '',
      type_id: '',
      status: ''
    });
    setEditTypes([]);
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
        message: `Error updating device: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  // Handle issue reporting
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
      setIssueDescription('');
      setSelectedDevice(null);
      fetchDevices();
    } catch (error) {
      setError(`Error submitting report: ${error.response?.data?.message || error.message}`);
    }
  };

  // Filter devices (no client-side pagination)
  const filteredDevices = devices;

  // Use backend pagination
  const paginatedDevices = filteredDevices;

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
        py: theme.customSpacing?.xl || 4,
        minHeight: '100vh'
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: theme.customSpacing?.lg || 3,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        Devices Management
      </Typography>

      {/* Filter Bar */}
      <Box sx={{ 
        mb: theme.customSpacing?.lg || 3, 
        display: 'flex', 
        gap: theme.customSpacing?.md || 2,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="decommissioned">Decommissioned</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="repair">Under Repair</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterType('all');
              setPage(1);
            }}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterCategory === 'all' || typesLoading}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          >
            <MenuItem value="all">All</MenuItem>
            {typesLoading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : types.length === 0 && filterCategory !== 'all' ? (
              <MenuItem disabled>No types found</MenuItem>
            ) : (
              types.map(type => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {(isAdmin || isStaff) && (
          <FormControl sx={{ minWidth: 160 }} size="small" disabled={officesLoading}>
            <InputLabel>Office</InputLabel>
            <Select
              value={filterOffice}
              label="Office"
              onChange={(e) => { setFilterOffice(e.target.value); setPage(1); }}
            >
              <MenuItem value="all">All</MenuItem>
              {officesLoading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : offices.length === 0 ? (
                <MenuItem disabled>No offices found</MenuItem>
              ) : (
                offices.map(office => (
                  <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={orderByCreated}
            label="Sort By"
            onChange={(e) => { setOrderByCreated(e.target.value); setPage(1); }}
          >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="earliest">Earliest</MenuItem>
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
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={() => logIssue(selectedDevice.id)}
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
      <Grid container spacing={2}>
        {paginatedDevices.length > 0 ? (
          paginatedDevices.map(device => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={device.id}>
              <DeviceCard
                device={device}
                isAdmin={isAdmin}
                isStaff={isStaff}
                onReport={(device) => {
                  setSelectedDevice(device);
                  setIsReportDialogOpen(true);
                }}
                onEdit={handleEditClick}
                types={types}
                categories={categories}
                offices={offices}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ py: 4 }}>
              {error ? 'Error loading devices' : 'No devices found'}
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {totalItems > rowsPerPage && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(totalItems / rowsPerPage)}
            page={page}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Add Device Button (Page-level top-right for admins/staff) */}
      {(isAdmin || isStaff) && (
        <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDeviceOpen(true)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Add Device
          </Button>
        </Box>
      )}

      {/* Add Device Button (Bottom for admins/staff) */}
      {(isAdmin || isStaff) && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDeviceOpen(true)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Add Device
          </Button>
        </Box>
      )}

      {/* Add Device FAB */}
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

      {/* Add Device Dialog */}
      <AddDevice
        open={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onSuccess={() => {
          fetchDevices();
          setIsAddDeviceOpen(false);
        }}
      />

      {/* Report Dialog */}
      <AddReport
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        preselectedDeviceId={selectedDevice?.id || ''}
        onSuccess={() => {
          setIsReportDialogOpen(false);
          setSnackbar({
            open: true,
            message: 'Report submitted successfully',
            severity: 'success'
          });
          fetchDevices();
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
                value={editFormData.category_id || 'all'}
                label="Category"
                onChange={async (e) => {
                  const categoryId = e.target.value;
                  setEditFormData({ ...editFormData, category_id: categoryId, type_id: 'all' });
                  if (categoryId !== 'all') {
                    try {
                      const res = await axios.get(`/api/device-categories/${categoryId}/types`);
                      setEditTypes(Array.isArray(res.data?.data?.types) ? res.data.data.types :
                                   Array.isArray(res.data?.types) ? res.data.types : []);
                    } catch {
                      setEditTypes([]);
                    }
                  } else {
                    setEditTypes([]);
                  }
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {editFormData.category_id !== 'all' && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={editFormData.type_id || 'all'}
                  label="Type"
                  onChange={(e) => setEditFormData({ ...editFormData, type_id: e.target.value })}
                >
                  <MenuItem value="all">All</MenuItem>
                  {editTypes.map((type) => (
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
                <MenuItem value="decommissioned">Decommissioned</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DEBUG: Show userRole and admin/staff flags */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, bgcolor: '#fff', px: 2, py: 0.5, borderBottom: '1px solid #eee', borderRight: '1px solid #eee', fontSize: 13 }}>
        userRole: <b>{userRole}</b> | isAdmin: <b>{String(isAdmin)}</b> | isStaff: <b>{String(isStaff)}</b>
      </Box>
      {/* TEMP: Always show Add Device button for debug */}
      <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDeviceOpen(true)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Add Device (DEBUG)
        </Button>
      </Box>

      {/* Snackbar */}
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