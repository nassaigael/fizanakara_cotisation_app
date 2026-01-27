import type {ContributionStatus} from "./common.type";
import { PaymentResponseDto } from "";

/**
 * Interface de base pour la structure d'une cotisation
 */
interface IBaseContribution {
    year: number;
    status: ContributionStatus;
}

/**
 * Utilisé pour initialiser une cotisation (ContributionCreateDto)
 * Le status est optionnel car géré par défaut à PENDING côté backend.
 */
export interface ContributionCreateDto extends Partial<IBaseContribution> {
    year: number;
}

/**
 * Pour les requêtes simples basées sur l'année (ContributionYearDto)
 */
export interface ContributionYearDto extends Pick<IBaseContribution, 'year'> {}

/**
 * Mise à jour d'une cotisation (ContributionUpdateDto)
 */
export interface ContributionUpdateDto {
    amount?: number;
    status?: ContributionStatus;
    memberId: string;
}

/**
 * Réponse complète de l'API (ContributionResponseDto)
 */
export interface ContributionResponseDto extends IBaseContribution {
    id: string;
    amount: number;
    dueDate: string;
    totalPaid: number;
    remaining: number;
    memberId: string;
    memberName: string;
    childId?: string;
    payments: PaymentResponseDto[];
}