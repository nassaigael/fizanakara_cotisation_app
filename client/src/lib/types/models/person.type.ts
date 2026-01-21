import { Gender, MemberStatus } from "./common.type";

/**
 * Interface de base pour les données personnelles
 * Correspond au contrat de PersonDto.java
 */
export interface PersonDto {
    firstName: string;
    lastName: string;
    birthDate: string; 
    gender: Gender;
    imageUrl: string;
    phoneNumber: string;
    status: MemberStatus;
    districtId: number;
    tributeId: number;
    parentId?: string; // Pour le lien hiérarchique "fils de"
}

/**
 * Réponse complète du serveur
 * Correspond à PersonResponseDto.java
 */
export interface PersonResponseDto extends Omit<PersonDto, 'districtId' | 'tributeId'> {
    id: string;
    createdAt: string;
    sequenceNumber: number;
    isActiveMember: boolean;
    districtId: number;
    districtName: string;
    tributeId: number;
    tributeName: string;
    parentName?: string;
    childrenCount: number;
    children?: PersonResponseDto[]; // Relation récursive
}