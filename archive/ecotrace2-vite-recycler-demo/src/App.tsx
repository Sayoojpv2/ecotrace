import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Overview from './pages/Overview';
import Alerts from './pages/Alerts';
import Pickup from './pages/Pickup';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import DataTracking from './pages/DataTracking';
import Timeline from './pages/Timeline';
import CustomerAuth from './pages/CustomerAuth';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminAutoLogin from './pages/AdminAutoLogin';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="pickup" element={<Pickup />} />
        <Route path="reports" element={<Reports />} />
        <Route path="documents" element={<Documents />} />
        <Route path="tracking" element={<DataTracking />} />
        <Route path="timeline" element={<Timeline />} />
      </Route>

      {/* Customer Portal Routes */}
      <Route path="/customer" element={<CustomerAuth />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />

      {/* Secret Admin Login — only accessible via direct link */}
      <Route path="/admin-e7c9f2a1b3d5" element={<AdminAutoLogin />} />
      <Route path="/admin-panel" element={<AdminPanel />} />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
