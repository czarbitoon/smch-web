import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Devices from './components/Devices';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Set authenticated state if token exists
    }
    setLoading(false); // Reset loading state
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Navigate to="/" />} /> {/* Added login route */}
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/devices" element={isAuthenticated ? <Devices /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;