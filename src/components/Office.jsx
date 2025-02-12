import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';

const Office = () => {
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    // Fetch offices from the API
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offices`)
      .then(response => setOffices(response.data))
      .catch(error => console.error('Error fetching offices:', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Offices
      </Typography>
      <Box>
        <List>
          {offices.map(office => (
            <ListItem key={office.id}>
              <ListItemText primary={office.name} secondary={`ID: ${office.id}`} />
              <Button onClick={() => {/* Logic to edit office */}}>Edit</Button>
              <Button onClick={() => {/* Logic to delete office */}}>Delete</Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Office;
