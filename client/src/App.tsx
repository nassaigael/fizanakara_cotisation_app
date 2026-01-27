import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './views/Login';
import MainLayout from './components/layout/MainLayout';
import AdminManagement from './views/AdminManagment';
import MemberManagement from './views/MemberManagement';
import ForgotPassword from './views/ForgotPassword';
import Dashboard from './views/Dashboard';
import ContributionManagement from './views/ContributionManagement';
import Profile from './views/Profile';
import { useEffect } from 'react';
import { applyThemeToDOM } from './lib/helper/helperTheme';
import { THEME } from './styles/theme';

export function App() {
    const { isAuthenticated, isSuperAdmin, loading, user } = useAuth();
    useEffect(() => {
        const savedColor = localStorage.getItem('app-theme-color');
        
        if (isAuthenticated && savedColor) {
            applyThemeToDOM(savedColor);
        } else {
            applyThemeToDOM('#E51A1A'); 
        }
    }, [isAuthenticated]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-brand-bg">
            <div className={THEME.card + " p-5 animate-bounce"}>
               <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    return (
        <Routes>
            <Route 
                path="/login" 
                element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            {isAuthenticated ? (
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/profile" element={<Profile/>} />

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/members" element={<MemberManagement />} />
                    <Route path="/cotisations" element={<ContributionManagement />} />
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