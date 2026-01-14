import type { Gender, MemberStatus } from './Common.types';

export interface ChildResponse
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
    // Parent information
    memberId: string;
    memberFirstName: string;
    memberLastName: string;
}

export interface ChildCreateRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  imageUrl: string;
  phoneNumber: string;
  status: MemberStatus;
  districtId: number;
  tributeId: number;
  memberId: string;// id parents
}

export interface ChildUpdateRequest {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  imageUrl?: string;
  phoneNumber?: string;
  status?: MemberStatus;
  districtId?: number;
  tributeId?: number;
  memberId?: string;
}