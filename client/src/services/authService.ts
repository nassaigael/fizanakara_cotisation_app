import api from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, Admin } from "../utils/types/models/Admin.types";

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<Admin> => {
        const response = await api.post<Admin>('/register', userData);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        return await api.post('/forgot-password', { email });
    },

    resetPassword: async (data: { token: string; newPassword: string }) => {
        return await api.post('/reset-password', data);
    }
    // Récupération du profil actuel (si besoin de rafraîchir les infos)
    // getMe: async (): Promise<Admin> => {
    //     const response = await api.get<Admin>('/admins/me');
    //     return response.data;
    // }
};