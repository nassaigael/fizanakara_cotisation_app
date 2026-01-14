import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Member from './pages/Member'; 
import Cotisation from './pages/Cotisation';
import ForgotPassword from './pages/ForgotPassword';
import AdminProfile from './pages/AdminProfiles';

import ManageAdmins from './pages/ManageAdmins';
import ManageOrganization from './pages/ManagerOrganization';

import MainLayout from './components/layout/MainLayout'; 

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="animate-spin ..." />;
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading } = useAuth();
  if (loading) return null;
  const isSuper = admin?.role?.toUpperCase() === 'SUPERADMIN';
  return isSuper ? <>{children}</> : <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          <Route path="/admin" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Member />} />
            <Route path="cotisations" element={<Cotisation />} />
            <Route path="profile" element={<AdminProfile />} />

            <Route path="manage-admins" element={<SuperAdminRoute><ManageAdmins /></SuperAdminRoute>} />
            <Route path="manage-tributes" element={<SuperAdminRoute><ManageOrganization /></SuperAdminRoute>} />
            <Route path="manage-districts" element={<SuperAdminRoute><ManageOrganization /></SuperAdminRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App