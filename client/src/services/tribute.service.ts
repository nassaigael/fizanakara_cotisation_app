import api from '../api/axios.config';
import { TributeDto } from '../lib/types/models/common.type';

const BASE_URL = '/api/admins/tributes';

export const TributeService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    create: async (data: TributeDto): Promise<any> => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    },

    update: async (id: number, data: TributeDto): Promise<any> => {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${BASE_URL}/${id}`);
    }
};