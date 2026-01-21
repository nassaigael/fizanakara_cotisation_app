import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { LoginRequestDTO, AdminResponseDto } from '../lib/types/models/admin.type';

const AuthContext = createContext<any>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('userData');
        const token = localStorage.getItem('accessToken');
        
        if (savedUser && token) {
            // On restaure l'utilisateur immédiatement sans appeler le backend
            setUser(JSON.parse(savedUser));
        }
        setLoading(false); 
    }, []);

    const login = async (credentials: LoginRequestDTO) => {
        try {
            const data = await AuthService.login(credentials);
            // Stockage strict
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('userData', JSON.stringify(data.user));
            localStorage.setItem('userRole', data.role);
            
            setUser(data.user);
            navigate('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isSuperAdmin: (user?.role || localStorage.getItem('userRole')) === 'SUPERADMIN',
        isAdmin: localStorage.getItem('userRole')?.trim() === 'ADMIN' || localStorage.getItem('userRole')?.trim() === 'SUPERADMIN',
        loading,
        login,
        logout
    };

    // On affiche l'app dès que le localStorage est lu
    if (loading) return null;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);