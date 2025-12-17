export type Gender = "MALE" | "FEMELLE";
export type Statut = "Étudiant" | "Travailleur" | "Enfant";
export type CotisationStatus = "Payé" | "En cours" | "En attente" | "Impayé";

export interface Member {
    id: string;
    sequenceNumber: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    statusSocial: Statut;
    imageUrl: string;
    tribe: string;
    phoneNumber: string;
    quartier: string;
    createDate: string;
    cotisationStatus?: CotisationStatus;
}

export interface Admin extends Member{
    email : string;
    password: string;
    verified : boolean;
}

export interface cotisation{
    id: number;
    proprietaire: Admin | Member;
    cotisationStatus: CotisationStatus;
    cotisationDue: number;
}