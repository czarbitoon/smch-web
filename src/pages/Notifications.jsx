import React from 'react';
import { Box, Typography } from '@mui/material';
import Notifications from '../components/Notifications';

const NotificationsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Notifications />
    </Box>
  );
};

export default NotificationsPage; 