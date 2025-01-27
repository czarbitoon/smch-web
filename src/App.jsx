import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Devices from './components/Devices';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Login setAuthenticated={setIsAuthenticated} />} />
        <Route path="/devices" element={isAuthenticated ? <Devices /> : <Login setAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}

export default App;
