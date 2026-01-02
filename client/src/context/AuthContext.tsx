import { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import api from '../services/api';
import { authService } from '../services/authService';
import type { Admin, AuthContextType } from '../utils/types/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialisation immédiate
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (!savedAdmin || savedAdmin === "undefined") return null;
    try {
      return JSON.parse(savedAdmin);
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Configuration de la sécurité Axios au démarrage
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const data = await authService.login(email, password);
      
      // Mise à jour des états
      setToken(data.accessToken);
      setAdmin(data.user);

      // Persistance des données
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('admin', JSON.stringify(data.user));
      
      // Injection immédiate dans Axios pour les appels suivants
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    } catch (error) {
      console.error("Échec de connexion au service d'authentification", error);
      throw error;
    }
  };

  const register = useCallback(async (userData: any) => {
    return await authService.register(userData);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};