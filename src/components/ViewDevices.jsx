import React, { useState, useEffect, useContext } from 'react'; // eslint-disable-line no-unused-vars

import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

const ViewDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userType, officeId } = useContext(AuthContext);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('/office-devices');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          {Number(userType) >= 2 ? 'All Devices' : `Devices in Your Office (ID: ${officeId})`}
        </Typography>
        <List>
          {devices.map(device => (
            <ListItem key={device.id}>
              <ListItemText
                primary={device.name}
                secondary={`Office: ${device.office.name}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ViewDevices;
