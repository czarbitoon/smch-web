import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ErrorFallback from './components/ErrorFallback';
// Notification features removed

// Lazy load components
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
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
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (!user || (requiredRole === "admin" && user.role !== "admin" && user.role !== "superadmin"))) {
    // Redirect to appropriate dashboard based on actual role
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'staff') {
      return <Navigate to="/staff/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();

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
              path="/register"
              element={
                <Suspense fallback={<LoadingScreen />}> 
                  <Register />
                </Suspense>
              }
            />
            <Route
              path="/"
              element={
                isLoading ? <LoadingScreen /> : <Navigate to={getDashboardRoute()} replace />
              }
            />
            {/* Main app routes with sidebar */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/offices" element={<Office />} />
              <Route path="/users" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<LoadingScreen />}>{React.createElement(lazy(() => import('./components/UserManagement')))}</Suspense></ProtectedRoute>} />
            </Route>
          </Routes>
        </Suspense>
        {/* Notification features removed */}
      </BrowserRouter>
    </ErrorBoundary>
  );
}
export default App;
