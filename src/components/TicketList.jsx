import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../context/AuthProvider';
import axios from '../axiosInstance';
import { delay } from '../utils/fetchUtils';

// Status color mapping
const statusColors = {
  'open': 'error',
  'in-progress': 'warning',
  'resolved': 'success',
  'closed': 'default'
};

// Priority color mapping
const priorityColors = {
  'low': 'info',
  'medium': 'warning',
  'high': 'error'
};

const TicketList = () => {
  const theme = useTheme();
  const { user, userRole } = useContext(AuthContext);
  
  // Authorize: only admins, superadmins, and staff can view this
  const isAuthorized = ['admin', 'superadmin', 'staff'].includes(userRole);

  // State
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignedTo, setFilterAssignedTo] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  
  // Dialog states
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignToUser, setAssignToUser] = useState('');
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch tickets sequentially to avoid tunnel overload
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (filterAssignedTo !== 'all') params.assigned_to = filterAssignedTo;

      const response = await axios.get('/tickets', { params });
      
      let ticketList = [];
      if (Array.isArray(response.data)) {
        ticketList = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ticketList = response.data.data;
      }

      setTickets(ticketList);
    } catch (err) {
      setError(`Error fetching tickets: ${err.response?.data?.message || err.message}`);
      setTickets([]);
      console.error('Fetch tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members for assignment dropdown
  const fetchStaffMembers = async () => {
    try {
      setStaffLoading(true);
      
      // In a real scenario, you'd have an endpoint to fetch staff members
      // For now, we'll assume staff are fetched as users
      // This is a placeholder - adjust based on your actual API
      
      setStaffMembers([]);
    } catch (err) {
      console.error('Error fetching staff members:', err);
    } finally {
      setStaffLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthorized) {
      // Fetch tickets first
      fetchTickets();
      
      // Add delay, then fetch staff members
      setTimeout(() => {
        fetchStaffMembers();
      }, 250);
    }
  }, [isAuthorized]);

  // Refetch when filters change
  useEffect(() => {
    if (isAuthorized) {
      fetchTickets();
    }
  }, [filterStatus, filterPriority, filterAssignedTo]);

  // Update ticket status
  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      const payload = { status: newStatus };
      if (newStatus === 'resolved' || newStatus === 'closed') {
        payload.resolution_notes = resolutionNotes;
      }

      const response = await axios.post(`/tickets/${selectedTicket.id}/status`, payload);
      
      setSnackbar({
        open: true,
        message: 'Ticket status updated successfully',
        severity: 'success'
      });

      // Update local state
      setTickets(tickets.map(t => t.id === selectedTicket.id ? response.data.ticket : t));
      
      setStatusDialogOpen(false);
      setSelectedTicket(null);
      setNewStatus('');
      setResolutionNotes('');
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error updating ticket: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };

  // Assign ticket to technician
  const handleAssignTicket = async () => {
    if (!selectedTicket || !assignToUser) return;

    try {
      const response = await axios.post(`/tickets/${selectedTicket.id}/assign`, {
        assigned_to: assignToUser
      });

      setSnackbar({
        open: true,
        message: 'Ticket assigned successfully',
        severity: 'success'
      });

      // Update local state
      setTickets(tickets.map(t => t.id === selectedTicket.id ? response.data.ticket : t));
      
      setAssignDialogOpen(false);
      setSelectedTicket(null);
      setAssignToUser('');
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error assigning ticket: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await axios.delete(`/tickets/${ticketId}`);
      
      setSnackbar({
        open: true,
        message: 'Ticket deleted successfully',
        severity: 'success'
      });

      setTickets(tickets.filter(t => t.id !== ticketId));
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error deleting ticket: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket => 
    ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.device?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You do not have permission to view this page. Only admins, superadmins, and staff can view tickets.
        </Alert>
      </Container>
    );
  }

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
        Helpdesk Tickets
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{
        mb: theme.customSpacing?.lg || 3,
        display: 'flex',
        gap: theme.customSpacing?.md || 2,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <TextField
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
        />

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => { setFilterStatus(e.target.value); }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e) => { setFilterPriority(e.target.value); }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tickets Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Device</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reporter</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <TableRow key={ticket.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {ticket.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>{ticket.device?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      color={statusColors[ticket.status]}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.priority}
                      color={priorityColors[ticket.priority]}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTechnician?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell>{ticket.reporter?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setNewStatus(ticket.status);
                          setStatusDialogOpen(true);
                        }}
                      >
                        Status
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setAssignToUser(ticket.assigned_to || '');
                          setAssignDialogOpen(true);
                        }}
                      >
                        Assign
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    No tickets found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Ticket Status</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            {(newStatus === 'resolved' || newStatus === 'closed') && (
              <TextField
                label="Resolution Notes"
                multiline
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Ticket</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Assign To (Staff/Admin)</InputLabel>
            <Select
              value={assignToUser}
              label="Assign To"
              onChange={(e) => setAssignToUser(e.target.value)}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {staffMembers.length > 0 ? (
                staffMembers.map(staff => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name} ({staff.role})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No staff members available</MenuItem>
              )}
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
            Note: Fetch staff members from your API as needed
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignTicket} variant="contained" color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </Container>
  );
};

export default TicketList;
