import type { UserBase, Role } from "./Common.types";

export interface Admin extends UserBase {
    email: string;
    verified: boolean;
    role: Role;
}

// Pour l'authentification (Synchronisé avec LoginRequestDTO.java)
export interface LoginRequest {
    email: string;
    password: string;
}

// Pour l'inscription (Synchronisé avec RegisterRequestDTO.java)
export interface RegisterRequest extends Omit<Admin, "id" | "verified" | "createdAt" | "sequenceNumber" | "role"> {
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: Admin;
}