import type { UserBase, MemberStatus } from "./Common.types";

export interface MemberResponse extends UserBase {
    status: MemberStatus;
    districtId: number;
    districtName: string; 
    tributeId: number;
    tributeName: string;
}

export interface ChildResponse extends UserBase {
    status: MemberStatus;
    districtId: number;
    districtName: string;
    tributeId: number;
    tributeName: string;
    memberId: string;
    memberFirstName: string;
    memberLastName: string;
}

export interface MemberCreateRequest {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    imageUrl: string;
    phoneNumber: string;
    status: MemberStatus;
    districtId: number;
    tributeId: number;
}