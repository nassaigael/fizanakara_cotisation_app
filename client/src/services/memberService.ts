import api from './api';
import type { Member, District, Tribute } from '../utils/types/types';

/**
 * memberService - Gère les opérations CRUD et la logique métier complexe
 * liée aux membres et aux finances.
 */
export const memberService = {
  
  // --- RÉCUPÉRATION ---
  getAll: async (): Promise<Member[]> => (await api.get('/admins/members')).data,
  getDistricts: async (): Promise<District[]> => (await api.get('/admins/districts')).data,
  getTribes: async (): Promise<Tribute[]> => (await api.get('/admins/tributes')).data,

  /**
   * RÉSOLUTIONS D'ID (UTILITAIRES)
   * Transforme un nom textuel en ID numérique. Crée la ressource si inexistante.
   */
  async resolveId(type: 'districts' | 'tributes', name: string): Promise<number> {
    if (!name || name.trim() === "") return 1; // Valeur par défaut "Non spécifié"
    
    const res = await api.get(`/admins/${type}`);
    const items = Array.isArray(res.data) ? res.data : [];
    
    const existing = items.find((i: any) => i.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing.id;

    // Auto-création si le District ou la Tribu n'existe pas encore
    const created = await api.post(`/admins/${type}`, { name: name.trim() });
    return created.data.id;
  },

  // --- GESTION DES MEMBRES ---
  async createWithDependencies(formData: any): Promise<Member> {
    const districtId = await this.resolveId('districts', formData.districtName);
    const tributeId = await this.resolveId('tributes', formData.tributeName);
    
    const { districtName, tributeName, ...cleanData } = formData;
    
    // On envoie un objet plat structuré pour JPA/Hibernate
    return (await api.post<Member>("/admins/members", { 
        ...cleanData, 
        districtId, 
        tributeId 
    })).data;
  },

  async update(id: string | number, formData: any): Promise<Member> {
    // Si formData contient districtName/tributeName, on résout les IDs
    let payload = { ...formData };
    
    if (formData.districtName || formData.tributeName) {
        const districtId = await this.resolveId('districts', formData.districtName);
        const tributeId = await this.resolveId('tributes', formData.tributeName);
        const { districtName, tributeName, ...cleanData } = formData;
        payload = { ...cleanData, districtId, tributeId };
    }

    return (await api.put<Member>(`/admins/members/${id}`, payload)).data;
  },

  delete: async (id: string | number) => await api.delete(`/admins/members/${id}`),

  // --- GESTION DES PAIEMENTS (CAISSE) ---
  /**
   * Enregistre un nouveau versement pour un membre.
   * Format attendu par le backend : { amount, year, date }
   */
  async addPayment(memberId: number | string, paymentData: { amount: number, year: number, date: string }) {
    return (await api.post(`/admins/members/${memberId}/payments`, paymentData)).data;
  },

  // --- MAINTENANCE (ADMIN ONLY) ---
  async clearAllData(): Promise<boolean> {
    try {
      const [members, districts, tribes] = await Promise.all([
        this.getAll(),
        this.getDistricts(),
        this.getTribes()
      ]);

      // Suppression séquentielle pour respecter les contraintes d'intégrité (FK)
      await Promise.all(members.map((m: any) => api.delete(`/admins/members/${m.id}`)));
      
      // On ignore les erreurs de suppression sur les districts/tribus s'ils sont encore liés
      await Promise.all([
        ...districts.map((d: any) => api.delete(`/admins/districts/${d.id}`).catch(() => {})),
        ...tribes.map((t: any) => api.delete(`/admins/tributes/${t.id}`).catch(() => {}))
      ]);
      
      return true;
    } catch (err) {
      console.error("Échec du nettoyage de la base de données:", err);
      return false;
    }
  }
};