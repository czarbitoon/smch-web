import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ErrorFallback from './components/ErrorFallback';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Devices = lazy(() => import('./pages/Devices'));
const Notifications = lazy(() => import('./pages/Notifications'));
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

const App = () => {
  // Prefetch components on app load
  React.useEffect(() => {
    const prefetchComponents = () => {
      const components = [
        () => import('./pages/Login'),
        () => import('./pages/Dashboard'),
        () => import('./pages/Devices'),
        () => import('./pages/Notifications'),
        () => import('./pages/Settings'),
      ];

      components.forEach(component => {
        // Prefetch after initial load
        setTimeout(() => {
          component();
        }, 1000);
      });
    };

    prefetchComponents();
  }, []);

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
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="devices"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Devices />
                  </Suspense>
                }
              />
              <Route
                path="notifications"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Notifications />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Settings />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
