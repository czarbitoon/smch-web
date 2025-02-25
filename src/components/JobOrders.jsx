import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../context/AuthProvider';
import axios from '../axiosInstance';

const JobOrders = () => {
  const [jobOrders, setJobOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobOrder, setSelectedJobOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const statusColors = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'error'
  };

  const priorityColors = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    urgent: 'error'
  };

  useEffect(() => {
    fetchJobOrders();
    const interval = setInterval(fetchJobOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/job-orders');
      setJobOrders(response.data.data);
    } catch (error) {
      setError('Error fetching job orders: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobOrder, newStatus) => {
    try {
      await axios.put(`/api/job-orders/${jobOrder.id}`, {
        status: newStatus,
        work_performed: jobOrder.work_performed,
        parts_used: jobOrder.parts_used,
        labor_hours: jobOrder.labor_hours
      });
      fetchJobOrders();
    } catch (error) {
      setError('Error updating job order: ' + (error.response?.data?.message || error.message));
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Orders
      </Typography>

      <Grid container spacing={3}>
        {jobOrders.map((jobOrder) => (
          <Grid item xs={12} md={6} key={jobOrder.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {jobOrder.job_type}
                  </Typography>
                  <Box>
                    <Chip
                      label={jobOrder.status}
                      color={statusColors[jobOrder.status]}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={jobOrder.priority}
                      color={priorityColors[jobOrder.priority]}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {jobOrder.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Assigned to: {jobOrder.assigned_to?.name}
                  </Typography>
                  <Typography variant="body2">
                    Device: {jobOrder.device?.name}
                  </Typography>
                  {jobOrder.started_at && (
                    <Typography variant="body2">
                      Started: {new Date(jobOrder.started_at).toLocaleString()}
                    </Typography>
                  )}
                  {jobOrder.completed_at && (
                    <Typography variant="body2">
                      Completed: {new Date(jobOrder.completed_at).toLocaleString()}
                    </Typography>
                  )}
                </Box>

                {user && (user.role >= 1 || jobOrder.assigned_to === user.id) && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedJobOrder(jobOrder);
                        setDialogOpen(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Job Order Status</DialogTitle>
        <DialogContent>
          {selectedJobOrder && (
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={selectedJobOrder.status}
                onChange={(e) => setSelectedJobOrder({ ...selectedJobOrder, status: e.target.value })}
                sx={{ mb: 2 }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>

              {selectedJobOrder.status === 'completed' && (
                <>
                  <TextField
                    fullWidth
                    label="Work Performed"
                    multiline
                    rows={3}
                    value={selectedJobOrder.work_performed || ''}
                    onChange={(e) => setSelectedJobOrder({ ...selectedJobOrder, work_performed: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Parts Used"
                    value={selectedJobOrder.parts_used || ''}
                    onChange={(e) => setSelectedJobOrder({ ...selectedJobOrder, parts_used: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Labor Hours"
                    value={selectedJobOrder.labor_hours || ''}
                    onChange={(e) => setSelectedJobOrder({ ...selectedJobOrder, labor_hours: e.target.value })}
                  />
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleUpdateStatus(selectedJobOrder, selectedJobOrder.status);
              setDialogOpen(false);
            }}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobOrders;