import api from './api';
import type { AuthResponse } from "../utils/types/types";

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        // On appelle /api/auth/login car on va ajouter @RequestMapping("/api/auth") au Java
        const response = await api.post('/auth/login', { email, password });
        
        // On s'assure que l'objet retourné correspond à ton interface AuthResponse
        // Java : Map.of("accessToken", ..., "user", ...)
        return {
            accessToken: response.data.accessToken,
            user: response.data.user,
            refreshToken: response.data.refreshToken
        };
    }
}