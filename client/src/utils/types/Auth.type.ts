import type { Admin } from "./User.type";

export interface AuthResponse
{
    user: Admin;
    accessToken: string;
    refreshToken: string;
}

export interface AuthContext
{
    admin: Admin;
    token: string;
    loading: boolean;
    login: (email: string, pass: string, remember: boolean) => Promise<void>;
    register: (userDate: Admin) => Promise<any>;
    logout: () => void;
}