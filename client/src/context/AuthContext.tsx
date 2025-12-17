import { createContext, useState, type ReactNode } from 'react';
import type { Admin } from '../utils/types/memberType';
import { authService } from '../services/authService';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (email: string, pass: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = async (email: string, pass: string, remember: boolean) => {
    const data = await authService.login(email, pass);
    
    setAdmin(data.admin);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.admin));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};