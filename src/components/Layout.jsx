import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppHeader />
        <Container component="main" sx={{ flex: 1, py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 