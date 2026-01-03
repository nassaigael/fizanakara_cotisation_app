import type { Member } from "./types/types";

export const TARIFS: Record<string, number> = {
    ETUDIANT: 20000,
    TRAVAILLEUR: 50000,
    ENFANT: 0,
};

export const getFinancials = (member: Member) => {
    const paye = Array.isArray(member.payments) 
        ? member.payments.reduce((acc, p) => acc + Number(p.amount || 0), 0) 
        : 0;
    const statut = member.status ? member.status.toUpperCase() : 'AUTRE';
    const montantDu = TARIFS[statut] || TARIFS.AUTRE;
    const reste = Math.max(0, montantDu - paye);
    
    return { 
        paye, 
        reste, 
        montantDu,
        isUpToDate: reste <= 0 
    };
};