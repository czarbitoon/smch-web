import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './context/AuthProvider'; // Import the AuthProvider
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '@coreui/coreui/dist/css/coreui.min.css'; // Import CoreUI CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
