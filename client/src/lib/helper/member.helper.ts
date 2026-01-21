import { MemberStatus } from "../types/models/common.type";

export const MemberHelper = {
    // Formater le badge de statut (WORKER/STUDENT)
    getStatusStyle: (status: MemberStatus) => {
        switch (status) {
            case "WORKER": return "bg-blue-100 text-blue-700 border-blue-200";
            case "STUDENT": return "bg-purple-100 text-purple-700 border-purple-200";
            default: return "bg-gray-100 text-gray-700";
        }
    },

    // Formater la date proprement
    formatDate: (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
};