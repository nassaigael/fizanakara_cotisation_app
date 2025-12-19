import { createContext, useState, useEffect,type ReactNode } from 'react';
import api from '../services/api';
import type { Admin, AuthContextType } from '../utils/types/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Synchronisation du token avec Axios au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          // Optionnel : On peut vérifier la validité du token ici via un endpoint /me
          // const res = await api.get('/auth/me');
          // setAdmin(res.data);
          
          // Pour l'instant on récupère l'admin stocké en local
          const savedAdmin = localStorage.getItem('admin');
          if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, adminData } = response.data;

      setToken(accessToken);
      setAdmin(adminData);

      if (rememberMe) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('admin', JSON.stringify(adminData));
      }
      
      // On injecte le token manuellement pour la première requête après login
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Identifiants incorrects");
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};