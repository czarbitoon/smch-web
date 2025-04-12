import React from 'react';
import { Box, Typography } from '@mui/material';
import Settings from '../components/Settings';

const SettingsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Settings />
    </Box>
  );
};

export default SettingsPage; 