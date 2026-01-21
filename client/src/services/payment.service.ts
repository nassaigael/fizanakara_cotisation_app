import api from '../api/axios.config';
import { PaymentDto, PaymentResponseDto } from '../lib/types/models/payment.type';

const BASE_URL = '/api/admins/payments';

export const PaymentService = {
    // GET /contribution/{contributionId}
    getByContribution: async (contributionId: string): Promise<PaymentResponseDto[]> => {
        const response = await api.get(`${BASE_URL}/contribution/${contributionId}`);
        return response.data;
    },

    // POST /
    create: async (data: PaymentDto): Promise<PaymentResponseDto> => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    },

    // PUT /{id}
    update: async (id: string, data: PaymentDto): Promise<PaymentResponseDto> => {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    // DELETE /{id}
    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE_URL}/${id}`);
    }
};