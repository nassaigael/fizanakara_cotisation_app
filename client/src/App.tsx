import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MemberPage from './pages/Member';
// Importe ton Layout qui contient la Sidebar
import MainLayout from './components/layout/MainLayout'; 
import ForgotPassword from './pages/ForgotPassword';

// Composant de protection
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route Publique */}
          <Route path="/" element={<Login />} />
          <Route path="/reset-password/:token" element={<ForgotPassword />} />
          {/* Routes Privées (Admin) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="member" element={<MemberPage />} />
            {/* Ajoute ici tes autres routes : tributes, settings... */}
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;