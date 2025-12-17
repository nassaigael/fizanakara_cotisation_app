import api from './api';
import type { Member } from '../utils/types/types';

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    // URL Backend : /admins/members (à protéger par ROLE_ADMIN)
    const response = await api.get('/admins/members');
    return response.data;
  },
  
  // Utilise string car ton generatedCustomId() renvoie un String
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admins/members/${id}`);
  },
  
  deleteMultiple: async (ids: string[]): Promise<void> => {
    await api.post('/admins/members/delete-batch', { ids });
  }
};