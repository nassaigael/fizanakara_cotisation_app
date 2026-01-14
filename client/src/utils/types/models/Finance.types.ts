import type { PaymentStatus, ContributionStatus } from "./Common.types";

export interface PaymentResponse {
    id: string;
    amountPaid: number;
    paymentDate: string; // ISO Date
    status: PaymentStatus;
    contributionId: string;
}


export interface PaymentCreateRequest {
    amountPaid: number;
    contributionId: string;
    status?: PaymentStatus;
}

export interface ContributionResponse {
    id: string;
    year: number;
    amount: number;
    status: ContributionStatus;
    dueDate: string;
    totalPaid: number;
    remaining: number;
    memberId: string;
    memberName: string;
    childId?: string; 
    payments: PaymentResponse[];
}
export interface ContributionCreateRequest {
    year: number;
    status?: ContributionStatus;
}

export interface ContributionUpdateRequest {
    amount?: number;
    status?: ContributionStatus;
    memberId: string;
}