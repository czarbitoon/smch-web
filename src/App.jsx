import { useContext, useState } from 'react';

import { CircularProgress, Box } from '@mui/material'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider'; 
import Login from './components/Login';
import Register from './components/Register';
import Devices from './components/Devices';

import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import UserDashboard from './components/UserDashboard';

import Offices from './components/Office'; // Import Offices component
import Reports from './components/Reports'; // Import Reports component
import AppHeader from './components/AppHeader'; 
import AppSidebar from './components/AppSidebar';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext); // Use global auth state
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };



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
          <AppHeader onToggleSidebar={toggleSidebar} />
          <AppSidebar isVisible={sidebarVisible} onToggle={toggleSidebar} />

          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />

            <Route path="/devices" element={<Devices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/offices" element={<Offices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/offices" element={<Offices />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />



          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

    </Router>
  );
}

export default App;
