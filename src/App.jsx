// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Devices from './components/Devices';
import Profile from './components/Profile';
import Reports from './components/Reports';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1877f2', // Facebook blue
    },
    secondary: {
      main: '#42b72a', // Facebook green
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Container maxWidth="lg">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                SMCH API
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" href="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" href="/devices">
                  Devices
                </Button>
                <Button color="inherit" href="/reports">
                  Reports
                </Button>
                <Button color="inherit" href="/profile">
                  Profile
                </Button>
                <Button color="inherit" href="/login">
                  Login
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/devices" element={<ProtectedRoute component={Devices} />} />
            <Route path="/reports" element={<ProtectedRoute component={Reports} />} />
            <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;