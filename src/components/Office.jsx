import { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import axios from 'axios';

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
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offices`)
      .then(response => {
        setOffices(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching offices:', error);
        setError('Failed to fetch offices. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/offices/${id}`);
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
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/offices/${selectedOffice.id}`, {
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
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Offices
      </Typography>
      <Box>
        {offices.length === 0 ? (
          <Typography variant="body1" mt={2}>
            No offices found.
          </Typography>
        ) : (
          <List>
            {offices.map(office => (
              <ListItem key={office.id}>
                <ListItemText primary={office.name} secondary={`ID: ${office.id}`} />
                <Button onClick={() => handleEditClick(office)}>Edit</Button>
                <Button onClick={() => handleDelete(office.id)} color="error">Delete</Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleEditClose}>
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Office</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Office Name"
              type="text"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
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
