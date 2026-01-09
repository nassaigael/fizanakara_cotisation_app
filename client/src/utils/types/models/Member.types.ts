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