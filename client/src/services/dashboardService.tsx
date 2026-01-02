import api from './api';
import type { Member } from '../utils/types/types';

/**
 * Service dédié à la gestion des membres et de leurs cotisations.
 * Utilise l'instance 'api' pré-configurée avec le token JWT.
 */
export const memberService = {
  /**
   * Récupère la liste complète des membres.
   * Chaque membre inclut ses relations (District, Tribu) et son historique de paiements.
   * @returns Promise<Member[]>
   */
  getAllMembers: async (): Promise<Member[]> => {
    try {
      // Le chemin est relatif à la baseURL '/api' définie dans api.ts
      const response = await api.get<Member[]>('/members');
      
      // On s'assure de renvoyer un tableau vide si le backend ne répond rien
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des membres:", error);
      throw error; // On propage l'erreur pour la gérer dans le Hook (ex: message d'alerte)
    }
  }
};