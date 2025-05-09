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
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import AddReport from './AddReport';
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
  const { user } = useContext(AuthContext);
  const userRole = user?.role || 'user';
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    // Only set up auto-refresh when form is not open
    let interval;
    if (!isAddModalOpen) {
      interval = setInterval(fetchReports, 30000);
    }
    return () => interval && clearInterval(interval);
  }, [isAddModalOpen]); // Add isAddModalOpen as dependency

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // If not admin/staff, only show reports from user's office
      if (userRole !== 'admin' && userRole !== 'staff') {
        params.append('office_id', user.office_id);
      }

      const response = await axios.get('/api/reports', { params });
      setReports(response.data);
    } catch (error) {
      setError('Error fetching reports: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
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
        resolution_notes: resolutionNotes
      });
      
      setSnackbar({
        open: true,
        message: 'Report resolved successfully',
        severity: 'success'
      });
      
      setResolveDialogOpen(false);
      setResolutionNotes('');
      setSelectedReport(null);
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
    setResolveDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton aria-label="Back" onClick={() => navigate(-1)} sx={{ mr: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, '&:hover': { bgcolor: 'grey.100' } }}>
            <ArrowBackIosNewIcon fontSize="medium" />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
            Reports
          </Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddModalOpen(true)}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 1.5
          }}
        >
          Add Report
        </Button>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <List sx={{ '& .MuiListItem-root': { px: 0, py: 1 } }}>
          {reports.map(report => (
            <ListItem key={report.id} button onClick={() => navigate(`/reports/${report.id}`)}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  width: '100%',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 2
                  }
                }}
              >
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
                      {report.title}
                    </Typography>
                    <Chip
                      label={report.status ? (report.status.charAt(0).toUpperCase() + report.status.slice(1)) : (report.resolved_by ? 'Resolved' : 'Pending')}
                      color={report.status === 'resolved' || report.resolved_by ? 'success' : report.status === 'pending' ? 'warning' : report.status === 'repair' ? 'info' : report.status === 'decommissioned' ? 'error' : 'default'}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body1" paragraph>
                    {report.description}
                  </Typography>
                  {report.device && (
                    <Typography variant="body2" color="text.secondary">
                      Device: {report.device.name || report.device_id}
                    </Typography>
                  )}
                  {report.office && (
                    <Typography variant="body2" color="text.secondary">
                      Office: {report.office.name || report.office_id}
                    </Typography>
                  )}
                  {report.image_url && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Image:
                      </Typography>
                      <Box>
                        <img src={report.image_url} alt="Report" style={{ width: 220, height: 180, borderRadius: 8, objectFit: 'cover' }} />
                      </Box>
                    </Box>
                  )}
                  {report.created_at && (
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(report.created_at).toLocaleString()}
                    </Typography>
                  )}
                  {report.resolved_by && (
                    <Typography variant="body2" color="text.secondary">
                      Resolved By: {report.resolved_by_user?.name || report.resolved_by_user?.email || report.resolved_by || 'Unknown'}
                    </Typography>
                  )}
                  {report.resolution_notes && (
                    <Typography variant="body2" color="text.secondary">
                      Resolution Notes: {report.resolution_notes}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>

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

      <AddReport
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchReports();
        }}
      />

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

// For admin controls in report history
const isAdmin = userRole === 'admin';
const isStaff = userRole === 'staff';

Use isAdmin or isStaff for permission checks and UI rendering
