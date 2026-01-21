import api from '../api/axios.config';
import { PersonDto, PersonResponseDto } from '../lib/types/models/person.type';

const BASE_URL = '/api/admins/persons'; // @RequestMapping("/api/admins/persons")

export const PersonService = {
    getAll: async (): Promise<PersonResponseDto[]> => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    create: async (data: PersonDto): Promise<PersonResponseDto> => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    },

    // POST /{parentId}/children
    addChild: async (parentId: string, data: PersonDto): Promise<PersonResponseDto> => {
        const response = await api.post(`${BASE_URL}/${parentId}/children`, data);
        return response.data;
    },

    // POST /{id}/promote
    promote: async (id: string): Promise<PersonResponseDto> => {
        const response = await api.post(`${BASE_URL}/${id}/promote`);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`${BASE_URL}/${id}`);
    }
};