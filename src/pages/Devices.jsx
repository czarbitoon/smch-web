import React from 'react';
import { Box, Typography } from '@mui/material';
import Devices from '../components/Devices';

const DevicesPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Devices Management
      </Typography>
      <Devices />
    </Box>
  );
};

export default DevicesPage; 