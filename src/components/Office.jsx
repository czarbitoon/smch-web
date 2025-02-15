import { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Office = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.error('Error deleting office:', error);
      setError('Failed to delete office. Please try again.');
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
                <Button onClick={() => {/* TODO: Implement edit functionality */}}>Edit</Button>
                <Button onClick={() => handleDelete(office.id)} color="error">Delete</Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Office;
