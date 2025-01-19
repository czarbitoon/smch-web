// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import Devices from './components/Devices';
import Login from './components/Login';
import Profile from './components/Profile';
import Reports from './components/Reports';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1877f2', 
    },
    secondary: {
      main: '#42b72a', 
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
                SMC Hardware Monitoring 
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
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/devices" component={Devices} />
            <Route path="/reports" component={Reports} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;