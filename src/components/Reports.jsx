// src/components/Reports.jsx
import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Snackbar,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOffice, setFilterOffice] = useState('all');
  const [offices, setOffices] = useState([]);
  const [newStatus, setNewStatus] = useState('resolved');
  const [orderByCreated, setOrderByCreated] = useState('latest');
  const { user } = useContext(AuthContext);
  const userRole = user?.role || 'user';
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    if ((userRole === 'admin' || userRole === 'staff')) {
      fetchOffices();
    }
    // Only set up auto-refresh when form is not open
    let interval;
    if (!isAddModalOpen) {
      interval = setInterval(fetchReports, 30000);
    }
    return () => interval && clearInterval(interval);
  }, [isAddModalOpen, filterStatus, filterOffice, orderByCreated]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if ((userRole === 'admin' || userRole === 'staff') && filterOffice !== 'all') {
        params.append('office_id', filterOffice);
      } else if (userRole !== 'admin' && userRole !== 'staff') {
        params.append('office_id', user.office_id);
      }
      params.append('order_by_created', orderByCreated);
      const response = await axios.get('/api/reports', { params });
      setReports(response.data);
    } catch (error) {
      setError('Error fetching reports: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await axios.get('/api/offices');
      setOffices(Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setOffices([]);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  const handleResolveReport = async () => {
    try {
      if (!resolutionNotes.trim()) {
        setSnackbar({
          open: true,
          message: 'Please provide resolution notes',
          severity: 'error'
        });
        return;
      }
      await axios.post(`/api/reports/${selectedReport.id}/resolve`, {
        resolution_notes: resolutionNotes,
        status: newStatus
      });
      setSnackbar({
        open: true,
        message: 'Report resolved successfully',
        severity: 'success'
      });
      setResolveDialogOpen(false);
      setResolutionNotes('');
      setSelectedReport(null);
      setNewStatus('resolved');
      fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error.response?.data || error);
      const errorMessage = error.response?.data?.error === 'Report is already resolved' ?
        'This report has already been resolved' :
        'Error resolving report: ' + (error.response?.data?.message || error.message);
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      
      if (error.response?.data?.error === 'Report is already resolved') {
        setResolveDialogOpen(false);
        setResolutionNotes('');
        setSelectedReport(null);
        fetchReports();
      }
    }
  };

  const handleOpenResolveDialog = (report) => {
    setSelectedReport(report);
    setNewStatus('resolved');
    setResolveDialogOpen(true);
  };

  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'Pending';
      case 'resolved': return 'Resolved';
      case 'repair': return 'Repair';
      case 'decommissioned': return 'Decommissioned';
      default: return 'Pending'; // fallback for unknown statuses
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'resolved': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'repair': return '#2196f3';
      case 'decommissioned': return '#f44336';
      default: return '#ff9800'; // fallback to Pending color
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, backgroundColor: '#f4f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              bgcolor: '#fff', 
              borderRadius: 2, 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <ArrowBackIosNewIcon fontSize="medium" color="primary" />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#222' }}>
            Reports
          </Typography>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={e => { setFilterStatus(e.target.value); }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="repair">Under Repair</MenuItem>
            <MenuItem value="decommissioned">Decommissioned</MenuItem>
          </Select>
        </FormControl>
        {(userRole === 'admin' || userRole === 'staff') && (
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>Office</InputLabel>
            <Select
              value={filterOffice}
              label="Office"
              onChange={e => { setFilterOffice(e.target.value); }}
            >
              <MenuItem value="all">All</MenuItem>
              {offices.map(office => (
                <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={orderByCreated}
            label="Sort By"
            onChange={e => setOrderByCreated(e.target.value)}
          >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="earliest">Earliest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Reports Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2, mb: 4 }}>
        {reports.map(report => {
          const statusColor = getStatusColor(report.status || (report.resolved_by ? 'resolved' : 'pending'));
          return (
            <Paper
              key={report.id}
              elevation={0}
              onClick={() => handleOpenResolveDialog(report)}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
                border: `2px solid ${statusColor}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Report Title */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#222',
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {report.title}
              </Typography>
              
              {/* Status */}
              <Typography 
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: statusColor,
                  textTransform: 'capitalize',
                  mb: 1
                }}
              >
                {getStatusLabel(report.status)}
              </Typography>
              
              {/* Description */}
              <Typography 
                variant="body2"
                sx={{
                  fontSize: '0.8125rem',
                  color: '#444',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  flexGrow: 1
                }}
              >
                {report.description}
              </Typography>
              
              {/* Additional Info */}
              <Box sx={{ mt: 'auto', pt: 1 }}>
                {report.device && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                    Device: {report.device.name || report.device_id}
                  </Typography>
                )}
                {report.created_at && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {reports.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No reports found
          </Typography>
        </Box>
      )}

      <Dialog
        open={resolveDialogOpen}
        onClose={() => setResolveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, typography: 'h5' }}>Resolve Report</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1">
              Are you sure you want to resolve this report?
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">New Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={newStatus}
                label="New Status"
                onChange={e => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="repair">Repair</MenuItem>
                <MenuItem value="decommissioned">Decommissioned</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Resolution Notes"
              multiline
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setResolveDialogOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResolveReport}
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              borderRadius: 1.5
            }}
          >
            Resolve
          </Button>
        </DialogActions>
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
    </Container>
  );
};

export default Reports;
