import api from './api';
import type { AuthResponse } from "../utils/types/types";

/**
 * AuthService - Encapsule les appels API liés à la sécurité.
 */
export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/login', { email, password });
        return response.data;
    },
    register: async (userData: any): Promise<any> => {
        const response = await api.post('/register', userData);
        return response.data;
    }
};