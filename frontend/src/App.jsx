import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppStore from './pages/AppStore';
import AppLaunch from './pages/AppLaunch';
import AdminPanel from './pages/AdminPanel';
import TenantSelection from './pages/TenantSelection';
import ForgotPassword from './auth/ForgotPassword';
import RoleGuard from './components/RoleGuard';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel',
          style: {
            background: 'hsl(var(--card) / 0.8)',
            color: '#fff',
            border: '1px solid hsl(var(--border))',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/select-tenant" element={<ProtectedRoute><TenantSelection /></ProtectedRoute>} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<AppStore />} />
            <Route path="apps" element={<AppStore />} />
            <Route path="launch/:appId" element={<AppLaunch />} />
            <Route path="admin" element={
              <RoleGuard roles={['super_admin', 'org_admin']}>
                <AdminPanel />
              </RoleGuard>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
