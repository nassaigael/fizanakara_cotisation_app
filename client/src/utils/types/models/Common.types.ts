export type Gender = "MALE" | "FEMALE";
export type MemberStatus = "WORKER" | "STUDENT";
export type Role = "ADMIN" | "SUPERADMIN";
export type PaymentStatus = "COMPLETED" | "REFUNDED" | "PENDING";
export type ContributionStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";

export interface UserBase {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string; // ISO String "YYYY-MM-DD"
    gender: Gender;
    imageUrl: string;
    phoneNumber: string;
    createdAt: string;
    sequenceNumber: number;
}

export interface District {
    id: number;
    name: string;
    version?: number;
}

export interface Tribute {
    id: number;
    name: string;
}