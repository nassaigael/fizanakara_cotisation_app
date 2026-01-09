import type { Gender, MemberStatus } from './Common.types';


export interface MemberResponse
{
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    imageUrl: string;
    phoneNumber: string;
    createdAt: string;
    sequenceNumber: number;
    status: MemberStatus;
    districtId: number;
    districtName: string;
    tributeId: number;
    tributeName: string;
}

export interface MemberCreateRequest
{
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    imageUrl: string;
    phoneNumber: string;
    status: MemberStatus;
    districtId: number;
    tributeId: number;
}


