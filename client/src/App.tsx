import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Member from './pages/Member'; 
import Cotisation from './pages/Cotisation';
import ForgotPassword from './pages/ForgotPassword';
import AdminProfile from './pages/AdminProfiles';

import MainLayout from './components/layout/MainLayout'; 

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-bg">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Member />} />
            <Route path="cotisations" element={<Cotisation />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;