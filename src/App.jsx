// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard.jsx';
import StaffDashboard from './components/StaffDashboard';
import Login from './components/Login';

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
                <Button color="inherit" href="/login">
                  Login
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/user/dashboard" component={UserDashboard} />
            <Route path="/staff/dashboard" component={StaffDashboard} />
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;