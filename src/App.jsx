// src\App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StaffDashboard from './components/StaffDashboard';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1877f2', // Facebook blue
    },
    secondary: {
      main: '#ffffff', // White
    },
  },
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Container maxWidth="lg">
            <AppBar position="static" sx={{ backgroundColor: '#1877f2' }}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
                  SMC Hardware Monitoring
                </Typography>
              </Toolbar>
            </AppBar>
            <Routes>
              <Route path="/" element={<Login setAuthenticated={setAuthenticated} />} />
              <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute component={AdminDashboard} />} />
              <Route path="/user/dashboard" element={<ProtectedRoute component={UserDashboard} />} />
              <Route path="/staff/dashboard" element={<ProtectedRoute component={StaffDashboard} />} />
            </Routes>
          </Container>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;