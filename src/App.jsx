import { useContext } from 'react';
import { CircularProgress, Box } from '@mui/material'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider'; 
import Login from './components/Login'; 
import Devices from './components/Devices';
import AdminDashboard from './components/AdminDashboard';
import AppHeader from './components/AppHeader'; 
import AppSidebar from './components/AppSidebar';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext); // Use global auth state

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    ); // Centered loading indicator
  }

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <AppHeader />
          <AppSidebar />
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </>
      ) : (
        <Login /> // No need for `setAuthenticated` prop (handled in AuthContext)
      )}
    </Router>
  );
}

export default App;
