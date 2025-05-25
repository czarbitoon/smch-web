import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ErrorFallback from './components/ErrorFallback';
// import Pusher from 'pusher-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Devices = lazy(() => import('./pages/DevicesPage'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component
const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Prefetch components on app load
  React.useEffect(() => {
    const prefetchComponents = () => {
      const components = [
        () => import('./pages/Login'),
        () => import('./pages/Dashboard'),
        () => import('./pages/Devices'),
        () => import('./pages/Settings'),
      ];
      components.forEach(component => {
        setTimeout(() => {
          component();
        }, 1000);
      });
    };
    prefetchComponents();
  }, []);

  // Modern home route logic: redirect to dashboard based on user type
  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.type === 2 || user.type === 3) return '/admin/dashboard';
    if (user.type === 1) return '/staff/dashboard';
    return '/user/dashboard';
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}> 
          <Routes>
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoadingScreen />}> 
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/"
              element={
                isLoading ? <LoadingScreen /> : <Navigate to={getDashboardRoute()} replace />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
              <Route path="devices" element={<Suspense fallback={<LoadingScreen />}><Devices /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<LoadingScreen />}><Settings /></Suspense>} />
            </Route>
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
              <Route path="devices" element={<Suspense fallback={<LoadingScreen />}><Devices /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<LoadingScreen />}><Settings /></Suspense>} />
            </Route>
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
              <Route path="devices" element={<Suspense fallback={<LoadingScreen />}><Devices /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<LoadingScreen />}><Settings /></Suspense>} />
            </Route>
          </Routes>
        </Suspense>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
export default App;
