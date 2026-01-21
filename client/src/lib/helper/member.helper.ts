import { MemberStatus } from "../types/models/common.type";

export const MemberHelper = {
    getStatusStyle: (status: MemberStatus) => {
        switch (status) {
            case "STUDENT": return "bg-blue-100 text-blue-700 border-blue-200";
            case "WORKER": return "bg-purple-100 text-purple-700 border-purple-200";
            default: return "bg-gray-100 text-gray-700";
        }
    },

    formatDate: (dateString: string) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString('fr-FR');
    },

    calculateAge: (birthDate: string) => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }
};