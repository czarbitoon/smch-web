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
const Login = lazy(() => import('./components/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const StaffDashboard = lazy(() => import('./components/StaffDashboard'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const Devices = lazy(() => import('./components/Devices'));
const Reports = lazy(() => import('./components/Reports'));
const Settings = lazy(() => import('./components/Settings'));
const Office = lazy(() => import('./components/Office'));

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
  const { isAuthenticated, isLoading, user, userRole } = useAuth();

  // Prefetch components on app load
  React.useEffect(() => {
    const prefetchComponents = () => {
      const components = [
        () => import('./components/Login'),
        () => import('./components/Office'),
        () => import('./components/Devices'),
        () => import('./components/Settings'),
        () => import('./components/Reports'),
      ];
      components.forEach(component => {
        setTimeout(() => {
          component();
        }, 1000);
      });
    };
    prefetchComponents();
  }, []);

  // Modern home route logic: redirect to dashboard based on user role
  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin' || user.role === 'superadmin') return '/admin/dashboard';
    if (user.role === 'staff') return '/staff/dashboard';
    return '/user/dashboard';
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
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
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/staff/dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
            <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={<LoadingScreen />}><Devices /></Suspense>} />
            </Route>
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Reports />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Settings />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/offices"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Office />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
export default App;
