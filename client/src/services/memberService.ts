import api from './api';
import type { Member, District, Tribute } from '../utils/types/types';

export const memberService = {
  
  // --- RÉCUPÉRATION ---
  getAll: async (): Promise<Member[]> => (await api.get('/admins/members')).data,
  getDistricts: async (): Promise<District[]> => (await api.get('/admins/districts')).data,
  getTributes: async (): Promise<Tribute[]> => (await api.get('/admins/tributes')).data,

  // --- RÉSOLUTIONS D'ID ---
  async resolveId(type: 'districts' | 'tributes', name: string): Promise<number> {
    if (!name || name.trim() === "") return 1; 
    
    const res = await api.get(`/admins/${type}`);
    const items = Array.isArray(res.data) ? res.data : [];
    
    const existing = items.find((i: any) => i.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing.id;

    // Création si inexistant (ton ami a un @PostMapping sur ces routes)
    const created = await api.post(`/admins/${type}`, { name: name.trim() });
    return created.data.id;
  },

// src/services/memberService.ts (Ajustements suggérés)

  async createWithDependencies(formData: any): Promise<Member> {
    // On résout les IDs en parallèle pour gagner du temps
    const [districtId, tributeId] = await Promise.all([
        this.resolveId('districts', formData.districtName),
        this.resolveId('tributes', formData.tributeName)
    ]);
    
    const { districtName, tributeName, ...cleanData } = formData;
    
    // Ton ami attend Gender.valueOf(), donc on s'assure que c'est en MAJUSCULES
    const payload = { 
        ...cleanData, 
        gender: formData.gender.toUpperCase(),
        districtId, 
        tributeId 
    };

    const response = await api.post<Member>("/admins/members", payload);
    return response.data;
  },

  async update(id: string | number, formData: any): Promise<Member> {
    let payload = { ...formData };
    
    if (formData.districtName || formData.tributeName) {
        const districtId = formData.districtName ? await this.resolveId('districts', formData.districtName) : formData.districtId;
        const tributeId = formData.tributeName ? await this.resolveId('tributes', formData.tributeName) : formData.tributeId;
        const { districtName, tributeName, ...cleanData } = formData;
        payload = { ...cleanData, districtId, tributeId };
    }

    // Le backend de ton ami utilise @PutMapping("/{id}")
    return (await api.put<Member>(`/admins/members/${id}`, payload)).data;
  },

  delete: async (id: string | number) => await api.delete(`/admins/members/${id}`),

  // --- MAINTENANCE (ADMIN ONLY) ---
  // Utilisons les routes "delete-all" de ton ami pour plus de performance
  async clearAllData(): Promise<boolean> {
    try {
      // Suppression globale via les routes dédiées de ton ami
      await api.delete('/admins/members/delete-all');
      await api.delete('/admins/districts/delete-all');
      await api.delete('/admins/tributes/delete-all');
      
      return true;
    } catch (err) {
      console.error("Échec du nettoyage complet:", err);
      return false;
    }
  }
};