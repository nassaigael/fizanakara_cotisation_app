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
  // 1. On définit l'admin de test (MOCK) en respectant TOUTE l'interface Admin
  const mockAdmin: Admin = {
    id: "dev-123",
    firstName: "Admin",
    lastName: "Test",
    email: "admin@test.com",
    gender: "MALE",
    statusSocial: "Travailleur",
    tribe: "Merina",
    imageUrl: "",
    phoneNumber: "0340000000",
    sequenceNumber: 1,
    createDate: "2023-01-01",
    password: "",
    verified: true,
    birthDate: "1990-01-01", // Propriété manquante corrigée
    quartier: "Analamahitsy"  // Propriété manquante corrigée
  };

  // 2. Initialisation correcte de l'état
  // Pour le test, on force l'admin. Plus tard, tu remettras la logique localStorage
  const [admin, setAdmin] = useState<Admin | null>(mockAdmin);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || "mock-token-123");

  const login = async (email: string, pass: string, remember: boolean) => {
    console.log("Tentative de login avec:", email, remember);
    // Note: Sans backend, authService.login va probablement échouer ici
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