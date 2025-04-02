import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './context/AuthProvider'; // Import the AuthProvider
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import { theme } from './styles/theme'; // Import our theme
import './styles/theme-init.css'; // Import theme initialization CSS first
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '@coreui/coreui/dist/css/coreui.min.css'; // Import CoreUI CSS


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
