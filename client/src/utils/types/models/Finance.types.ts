import type { PaymentStatus, ContributionStatus } from "./Common.types";

/**
 * PAIMENT - Synchronisé avec PaymentResponseDto.java et PaymentDto.java
 */
export interface PaymentResponse {
    id: string;              // Format: "PAY-YYYYMMDD-XXXX"
    amountPaid: number;      // Correspond au BigDecimal backend
    paymentDate: string;     // ISO String (LocalDateTime)
    status: PaymentStatus;
    contributionId: string;  // Lien vers la dette
}

export interface PaymentCreateRequest {
    amountPaid: number;
    contributionId: string;
    status?: PaymentStatus;  // Optionnel car défaut = COMPLETED côté backend
}

/**
 * CONTRIBUTION - Synchronisé avec ContributionResponseDto.java
 * C'est le contrat le plus important pour ton tableau de bord financier.
 */
export interface ContributionResponse {
    id: string;              // Format: "COT2026-001"
    year: number;            // Type Year en Java
    amount: number;          // Montant total à payer
    status: ContributionStatus;
    dueDate: string;         // Date limite de paiement
    
    // Champs calculés par le Backend
    totalPaid: number;       // Somme des paiements déjà faits
    remaining: number;       // Ce qu'il reste à payer (amount - totalPaid)
    
    memberId: string;
    memberName: string;      // Nom du parent/membre pour affichage rapide
    childId?: string;        // Présent seulement si c'est une cotisation enfant
    
    payments: PaymentResponse[]; // Liste détaillée des transactions
}

export interface ContributionCreateRequest {
    year: number;
    status?: ContributionStatus; // Défaut: PENDING
}

export interface ContributionUpdateRequest {
    amount?: number;
    status?: ContributionStatus;
    memberId: string; // Obligatoire pour le lien backend
}