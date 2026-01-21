import api from '../api/axios.config';
import { LoginRequestDTO, RegisterRequestDTO, AdminResponseDto, UpdateAdminDto } from '../lib/types/models/admin.type';

export const AuthService = {
    // POST /login
    login: async (credentials: LoginRequestDTO) => {
        const response = await api.post('/login', credentials);
        return response.data;
    },

    // POST /register (Protégé par SUPERADMIN)
    register: async (data: RegisterRequestDTO) => {
        const response = await api.post('/register', data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        return await api.post('/forgot-password', { email });
    },

    // GET /admins/me
    getMe: async (): Promise<AdminResponseDto> => {
        const response = await api.get('/admins/me');
        return response.data;
    },

    // PATCH /admins/me
    updateMe: async (data: UpdateAdminDto) => {
        const response = await api.patch('/admins/me', data);
        return response.data;
    },
    verifyResetToken: async (token: string) => {
        // Cette méthode appelle votre backend pour valider le token et récupérer les infos de l'admin
        const response = await api.get(`/auth/verify-reset-token?token=${token}`);
        return response.data; 
    },
    
    // Assurez-vous que resetPassword est bien là aussi
    resetPassword: async (data: { token: string; newPassword: string }) => {
        return await api.post('/auth/reset-password', data);
    }
};