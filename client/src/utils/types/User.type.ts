import type { District, Tribute } from "./Local.type";

export type Gender = "HOMME" | "FEMME";
export type Status = 'Etudiant' | 'Travailleur';
export type CotisationStatus = "Payé" | "En cours";

export interface User
{
    id: string;
    sequenceNumber: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: Gender;
    phoneNumber: string;
    createdAt: Date;
    imageUrl: string;
}

export interface Admin extends User
{
    email: string;
    verified: boolean;
}

export interface Membre extends User
{
    status: Status;
    District: District;
    Tribut: Tribute;
}