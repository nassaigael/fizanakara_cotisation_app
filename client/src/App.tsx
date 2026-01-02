import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Member from './pages/Member'; 
import MainLayout from './components/layout/MainLayout'; 
import ForgotPassword from './pages/ForgotPassword';


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
            {/* Redirection automatique /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Gestion des membres (Groupée pour évolutions futures) */}
            <Route path="member">
              <Route index element={<Member />} />
              {/* Tu pourras ajouter ici : <Route path=":id" element={<MemberDetails />} /> */}
            </Route>
          </Route>

          {/* CATCH ALL : Redirige les URLs inconnues vers l'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;