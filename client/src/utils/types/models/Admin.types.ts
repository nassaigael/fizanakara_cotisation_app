import type { Gender } from "./Common.types";

export interface Admin {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    imageUrl: string;
    phoneNumber: string;
    email: string;
    verified: boolean;
    role: string;
    createdAt?: string; 
}

export interface AuthContextType {
    admin: Admin | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (userData: any) => Promise<any>;
    updateAdminState: (updatedAdmin: Admin) => void;
}

export interface LoginResponse {
    accessToken: string;
    user: Admin;
}

export interface RegisterRequest extends Omit<Admin, 'id' | 'verified' | 'createdAt'>
{
    password: string;
}

export interface UpdateAdmin
{
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: Gender;
    imageUrl?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    verified?: boolean;
}