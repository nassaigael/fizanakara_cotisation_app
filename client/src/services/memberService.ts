import api from './api';
import type { Member, District, Tribute, PaymentHistory } from '../utils/types/types';

// --- LOGIQUE INTERNE (Privée au module) ---
async function resolveId(type: 'districts' | 'tributes', name: string): Promise<number> {
    if (!name || name.trim() === "") return 1; 
    const res = await api.get(`/admins/${type}`);
    const items = Array.isArray(res.data) ? res.data : [];
    
    const existing = items.find((i: any) => i.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing.id;

    const created = await api.post(`/admins/${type}`, { name: name.trim() });
    return created.data.id;
}

// --- EXPORT DU SERVICE ---
export const memberService = {
  
  // --- LECTURE ---
  getAll: async (): Promise<Member[]> => (await api.get('/admins/members')).data,
  getDistricts: async (): Promise<District[]> => (await api.get('/admins/districts')).data,
  getTributes: async (): Promise<Tribute[]> => (await api.get('/admins/tributes')).data,

  // --- ACTIONS ---
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

  // ✅ AJOUT DE LA MÉTHODE MANQUANTE (Pour fixer l'erreur de PaymentModal)
  async addPayment(memberId: string | number, payment: Partial<PaymentHistory>): Promise<any> {
    // Si ton backend utilise une route spécifique :
    return (await api.post(`/admins/members/${memberId}/payments`, payment)).data;
  },

  delete: async (id: string | number) => await api.delete(`/admins/members/${id}`),

  /**
   * @private Cette méthode ne devrait être appelée que par un SuperAdmin
   */
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