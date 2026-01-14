import type { UserBase, Role } from "./Common.types";

export interface Admin extends UserBase {
    email: string;
    verified: boolean;
    role: Role;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends Omit<Admin, "id" | "verified" | "createdAt" | "sequenceNumber" | "role"> {
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: Admin; 
}

export interface AuthContextType {
    admin: Admin | null;
    token: string | null;
    login: (data: LoginResponse) => Promise<void>;
    logout: () => void;
    register: (userData: RegisterRequest) => Promise<Admin>;
    loading: boolean;
    updateAdminState: (updatedAdmin: Admin) => void;
}

