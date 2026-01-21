import api from '../api/axios.config';
import { ContributionResponseDto, ContributionYearDto, ContributionUpdateDto } from '../lib/types/models/contribution.type';

const BASE_URL = '/api/admins/contributions';

export const ContributionService = {
    // GET /person/{personId}/year/{year}
    getByPersonAndYear: async (personId: string, year: number): Promise<ContributionResponseDto[]> => {
        const response = await api.get(`${BASE_URL}/person/${personId}/year/${year}`);
        return response.data;
    },

    // POST / (Génération batch par année)
    generateForYear: async (data: ContributionYearDto): Promise<ContributionResponseDto[]> => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    },

    update: async (id: string, data: ContributionUpdateDto): Promise<ContributionResponseDto> => {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data;
    }
};