import { PersonResponseDto } from "../../lib/types/models/person.type";

export const getFinancials = (member: PersonResponseDto) => {
    // Note: Ces données devront venir de ton futur endpoint Cotisation
    // Pour l'instant on simule pour garder le design
    return {
        paye: 0, 
        reste: 5000 // Exemple de cotisation annuelle
    };
};