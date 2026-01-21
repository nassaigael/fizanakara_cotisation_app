import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './views/Login';
import MainLayout from './components/layout/MainLayout';
import AdminManagement from './views/AdminManagment';
import MemberManagement from './views/MemberManagement';
import ForgotPassword from './views/ForgotPassword';
const Placeholder = ({ title }: { title: string }) => (
    <div className="bg-white border-2 border-brand-border border-b-8 p-10 rounded-[2.5rem]">
        <h2 className="text-2xl font-black text-brand-text uppercase">{title}</h2>
        <p className="text-brand-muted mt-2">Page en cours de construction...</p>
    </div>
);

export function App() {
    const { isAuthenticated, isSuperAdmin, loading } = useAuth();

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-brand-bg">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <Routes>
            <Route 
                path="/login" 
                element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ForgotPassword />} />

            {isAuthenticated ? (
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    
                    <Route path="/dashboard" element={<Placeholder title="Tableau de Bord" />} />
                    
                    <Route path="/members" element={<MemberManagement />} />
                    
                    {isSuperAdmin && (
                        <Route path="/management" element={<AdminManagement />} />
                    )}
                </Route>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}