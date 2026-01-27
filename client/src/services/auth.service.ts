import api from '../api/axios.config';
import { LoginRequestDTO, RegisterRequestDTO, AdminResponseDto, UpdateAdminDto } from '../lib/types/models/admin.type';

export const AuthService = {
    login: async (credentials: LoginRequestDTO) => {
        const response = await api.post('/login', credentials);
        return response.data;
    },

    register: async (data: RegisterRequestDTO) => {
        const response = await api.post('/register', data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        return await api.post('/forgot-password', { email });
    },

    getMe: async (): Promise<AdminResponseDto> => {
        const response = await api.get('/admins/me');
        return response.data;
    },

    updateMe: async (data: UpdateAdminDto) => {
        const response = await api.patch('/admins/me', data);
        return response.data;
    },
    verifyResetToken: async (token: string) => {
        const response = await api.get(`/auth/verify-reset-token?token=${token}`);
        return response.data; 
    },
    resetPassword: async (data: { token: string; newPassword: string }) => {
        return await api.post('/reset-password', data);
    }
};