import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '../services/api';
import type { Admin, AuthContextType, LoginResponse } from '../utils/types/models/Admin.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const saved = localStorage.getItem('admin');
    return (saved && saved !== "undefined") ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const login = async (data: LoginResponse) => {
    const userNormalized: Admin = {
      ...data.user,
      firstName: (data.user as any).firstname, 
      lastName: (data.user as any).lastname,
      role: (data.user as any).email === 'fizanakara.super.adm@gmail.com' ? 'SUPERADMIN' : 'ADMIN'
    } as Admin;

    setToken(data.accessToken);
    setAdmin(userNormalized);
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('admin', JSON.stringify(userNormalized));
  };

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading, register: {} as any, updateAdminState: () => {} }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};