import api from './api';
import type { District, Tribute } from '../utils/types/models/Common.types';
import type { RegisterRequestDTO, AdminResponseDto } from '../utils/types/models/Auth.types';

export const superAdminService = {
  registerAdmin: async (data: RegisterRequestDTO): Promise<AdminResponseDto> => {
    const response = await api.post<AdminResponseDto>('/register', data);
    return response.data;
  },
  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/admins/${id}`);
  },

  //disctrict
  getDistricts: () => api.get<District[]>('/admins/districts').then(res => res.data),
  createDistrict: (name: string) => api.post<District>('/admins/districts', { name }).then(res => res.data),
  deleteDistrict: (id: number) => api.delete(`/admins/districts/${id}`),

  //Tribut
  getTributes: () => api.get<Tribute[]>('/admins/tributes').then(res => res.data),
  createTribute: (name: string) => api.post<Tribute>('/admins/tributes', { name }).then(res => res.data),
  deleteTribute: (id: number) => api.delete(`/admins/tributes/${id}`),
};
