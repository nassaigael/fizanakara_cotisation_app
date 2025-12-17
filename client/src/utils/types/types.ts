import type { Admin } from "./memberType";

export interface AuthResponse{
    admin : Admin;
    token : string;
    refreshToken : string;
}

export interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<void>;
  logout: () => void;
}


