import api from './api';
import type { Member, District, Tribute, PaymentHistory } from '../utils/types/types';

async function resolveId(type: 'districts' | 'tributes', name: string): Promise<number> {
  if (!name || name.trim() === "") return 1; 
  const res = await api.get(`/admins/${type}`);
  const items = Array.isArray(res.data) ? res.data : [];
  
  const existing = items.find((i: any) => i.name.toLowerCase() === name.trim().toLowerCase());
  if (existing) return existing.id;

  const created = await api.post(`/admins/${type}`, { name: name.trim() });
  return created.data.id;
}

export const memberService = {
  
  getAll: async (): Promise<Member[]> => (await api.get('/admins/members')).data,
  getDistricts: async (): Promise<District[]> => (await api.get('/admins/districts')).data,
  getTributes: async (): Promise<Tribute[]> => (await api.get('/admins/tributes')).data,

  async createWithDependencies(formData: any): Promise<Member> {
    const [districtId, tributeId] = await Promise.all([
      resolveId('districts', formData.districtName),
      resolveId('tributes', formData.tributeName)
    ]);

    const { districtName, tributeName, ...cleanData } = formData;
    const payload = { 
      ...cleanData, 
      gender: formData.gender.toUpperCase(),
      districtId, 
      tributeId 
    };
    return (await api.post<Member>("/admins/members", payload)).data;
  },

  async update(id: string | number, formData: any): Promise<Member> {
    let payload = { ...formData };
    
    if (formData.districtName || formData.tributeName) {
      const districtId = formData.districtName ? await resolveId('districts', formData.districtName) : formData.districtId;
      const tributeId = formData.tributeName ? await resolveId('tributes', formData.tributeName) : formData.tributeId;
      const { districtName, tributeName, ...cleanData } = formData;
      payload = { ...cleanData, districtId, tributeId };
    }
    return (await api.put<Member>(`/admins/members/${id}`, payload)).data;
  },

  async addPayment(memberId: string | number, payment: Partial<PaymentHistory>): Promise<any> {
    return (await api.post(`/admins/members/${memberId}/payments`, payment)).data;
  },

  delete: async (id: string | number) => await api.delete(`/admins/members/${id}`),

  async clearAllData(): Promise<boolean> {
    try {
      await Promise.all([
        api.delete('/admins/members/delete-all'),
        api.delete('/admins/districts/delete-all'),
        api.delete('/admins/tributes/delete-all')
      ]);
      return true;
    } catch (err) {
      console.error("Échec du nettoyage:", err);
      return false;
    }
  }
};