import { useContext, useState } from 'react';

import { CircularProgress, Box } from '@mui/material'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider'; 
import Login from './components/Login';
import Register from './components/Register';
import Devices from './components/Devices';
import AddDevice from './components/AddDevice';
import AddOffice from './components/AddOffice';
import AddReport from './components/AddReport';

import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import UserDashboard from './components/UserDashboard';

import Offices from './components/Office'; // Import Offices component
import Reports from './components/Reports'; // Import Reports component
import AppHeader from './components/AppHeader'; 
import AppSidebar from './components/AppSidebar';

function App() {
  const { isAuthenticated, loading, userRole } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const getDashboardRoute = () => {
    if (!isAuthenticated) return '/login';
    const role = Number(userRole);
    if (role >= 2) return '/admin/dashboard';
    if (role === 1) return '/staff/dashboard';
    return '/user/dashboard';
  };

  const ProtectedRoute = ({ element: Element, requiredRole }) => {
    // Only redirect if not authenticated
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    // Only check role if requiredRole is specified
    if (requiredRole !== undefined) {
      const currentRole = Number(userRole);
      const requiredRoleNum = Number(requiredRole);
      
      // Only redirect if user's role is insufficient
      if (currentRole < requiredRoleNum) {
        // Instead of redirecting to dashboard, show an error or restricted access message
        return <Navigate to="/unauthorized" replace />;
      }
    }
    
    // If all checks pass, render the protected component
    return Element;
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <AppHeader onToggleSidebar={toggleSidebar} />
          <AppSidebar isVisible={sidebarVisible} onToggle={toggleSidebar} />
          <Routes>
            <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute element={<AdminDashboard />} requiredRole={2} />}
            />
            <Route
              path="/staff/dashboard"
              element={<ProtectedRoute element={<StaffDashboard />} requiredRole={1} />}
            />
            <Route
              path="/user/dashboard"
              element={<ProtectedRoute element={<UserDashboard />} requiredRole={0} />}
            />
            <Route
              path="/devices"
              element={<ProtectedRoute element={<Devices />} />}
            />
            <Route
              path="/devices/add"
              element={<ProtectedRoute element={<AddDevice isStandalone={true} />} requiredRole={1} />}
            />
            <Route
              path="/reports"
              element={<ProtectedRoute element={<Reports />} />}
            />
            <Route
              path="/reports/add"
              element={<ProtectedRoute element={<AddReport />} />}
            />
            <Route
              path="/offices"
              element={<ProtectedRoute element={<Offices />} />}
            />
            <Route
              path="/offices/add"
              element={<ProtectedRoute element={<AddOffice />} requiredRole={2} />}
            />
            <Route
              path="/admin/register"
              element={<ProtectedRoute element={<Register />} requiredRole={2} />}
            />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Register />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
