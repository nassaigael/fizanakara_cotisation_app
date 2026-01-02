import api from './api';
import type { AuthResponse } from "../utils/types/types";

/**
 * AuthService - Encapsule les appels API liés à la sécurité.
 */
export const authService = {
    /**
     * Tente de connecter l'administrateur.
     * Le backend doit retourner le format AuthResponse (token + user).
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        // Le chemin final devient : /api/login
        const response = await api.post<AuthResponse>('/login', { email, password });
        return response.data;
    },

    /**
     * Enregistre un nouvel administrateur.
     */
    register: async (userData: any): Promise<any> => {
        const response = await api.post('/register', userData);
        return response.data;
    }
};