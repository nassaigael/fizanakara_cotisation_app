import api from './api'; // ✅ Importe ton instance personnalisée
import type { AdminResponse, UpdateAdminDto } from '../utils/types/types';

// ✅ Définition de la base de l'URL pour ce service spécifique
// Puisque ton instance 'api' a déjà la baseURL, on met juste le segment manquant
const ADMIN_PATH = '/admins'; 

export const adminService = {
    // Récupérer le profil connecté
    getMe: async (): Promise<AdminResponse> => {
        // ✅ Utilise 'api' au lieu de 'axios' pour profiter du token automatique
        const response = await api.get<AdminResponse>(`${ADMIN_PATH}/me`);
        return response.data;
    },

    // Mettre à jour les informations
    updateMe: async (data: UpdateAdminDto): Promise<{ message: string; user: AdminResponse }> => {
        const response = await api.patch(`${ADMIN_PATH}/me`, data);
        return response.data;
    },

    // Supprimer le compte
    deleteAccount: async (id: string): Promise<void> => {
        await api.delete(`${ADMIN_PATH}/${id}`);
    }
};