import { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import api from '../services/api';
import { authService } from '../services/authService';
import type { Admin, AuthContextType } from '../utils/types/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialisation avec vérification de sécurité sur le localStorage
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

  // Synchronisation du header Authorization d'Axios
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  // ✅ FONCTION DE MISE À JOUR (Pour la Navbar et le Profil)
  const updateAdminState = (updatedAdmin: Admin) => {
    setAdmin({ ...updatedAdmin }); // On recrée un objet pour forcer le refresh React
    localStorage.setItem('admin', JSON.stringify(updatedAdmin));
  };

  // ✅ LOGIN COMPLET (avec Token et RefreshToken)
 const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      
      // ✅ ON "MAPPE" LES DONNÉES POUR CORRIGER LE BACKEND
      const formattedUser: Admin = {
        ...data.user,
        // On transforme 'firstname' (backend) en 'firstName' (frontend)
        firstName: data.user.firstName || data.user.firstName,
        lastName: data.user.lastName || data.user.lastName,
        // On s'assure que l'imageUrl est bien là (si le backend l'envoie enfin)
        imageUrl: data.user.imageUrl || data.user.imageUrl || "" 
      };

      setToken(data.accessToken);
      setAdmin(formattedUser);

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('admin', JSON.stringify(formattedUser));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    } catch (error) {
      console.error("Échec de connexion", error);
      throw error;
    }
  };

  const register = useCallback(async (userData: any) => {
    return await authService.register(userData);
  }, []);

  // ✅ LOGOUT COMPLET (Nettoyage total)
  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider value={{ 
        admin, 
        token, 
        login, 
        logout, 
        register, 
        loading, 
        updateAdminState 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};