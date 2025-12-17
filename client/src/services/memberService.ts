import api from './api';
import type { Member } from '../utils/types/types';

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    // URL Backend : /admins/members (à protéger par ROLE_ADMIN)
    const response = await api.get('/admins/members');
    return response.data;
  },
  create: async (data: Partial<Member>) => {
    const response = await api.post<Member>("/members", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Member>) => {
    const response = await api.put<Member>(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/admins/members/${id}`);
  },

  deleteMultiple: async (ids: string[]) => {
    await api.post("/members/delete-batch", { ids });
  },
  
};