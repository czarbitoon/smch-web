import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Paper } from '@mui/material';
import axios from '../axiosInstance';

const Office = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Fetch offices from the API
    axios.get('/offices')
      .then(response => {
        const responseData = response.data;
        console.log('[Office] API Response:', responseData); // Debug log
        
        if (responseData?.success && responseData?.data?.offices) {
          // Handle the specific response structure where offices are under data.offices
          console.log('[Office] Using offices data:', responseData.data.offices);
          setOffices(responseData.data.offices);
        } else if (responseData?.data?.data) {
          // Handle paginated response
          console.log('[Office] Using paginated data:', responseData.data.data);
          setOffices(responseData.data.data);
        } else if (Array.isArray(responseData)) {
          // Handle direct array response
          console.log('[Office] Using direct array:', responseData);
          setOffices(responseData);
        } else {
          console.error('[Office] Invalid data format received:', responseData);
          setOffices([]);
          setError('Invalid data format received from server');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching offices:', error);
        setError('Failed to fetch offices. Please try again later.');
        setLoading(false);
        setOffices([]); // Ensure offices is an empty array on error
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/offices/${id}`);
      setOffices(offices.filter(office => office.id !== id));
      setSnackbar({ open: true, message: 'Office deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting office:', error);
      setError('Failed to delete office. Please try again.');
      setSnackbar({ open: true, message: 'Failed to delete office', severity: 'error' });
    }
  };

  const handleEditClick = (office) => {
    setSelectedOffice(office);
    setEditedName(office.name);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedOffice(null);
    setEditedName('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOffice || !editedName.trim()) return;

    try {
      await axios.put(`/offices/${selectedOffice.id}`, {
        name: editedName.trim()
      });

      setOffices(offices.map(office =>
        office.id === selectedOffice.id ? { ...office, name: editedName.trim() } : office
      ));

      handleEditClose();
      setSnackbar({ open: true, message: 'Office updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error updating office:', error);
      setSnackbar({ open: true, message: 'Failed to update office', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Offices
      </Typography>
      <Box sx={{ mt: 3 }}>
        {offices.length === 0 ? (
          <Typography variant="body1" mt={2}>
            No offices found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {offices.map(office => (
              <Grid item xs={12} sm={6} md={4} key={office.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {office.name}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditClick(office)}
                      sx={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(office.id)}
                      sx={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <form onSubmit={handleEditSubmit}>
          <DialogTitle sx={{ pb: 2, typography: 'h5' }}>Edit Office</DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Office Name"
              type="text"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleEditClose}
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
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default Office;
