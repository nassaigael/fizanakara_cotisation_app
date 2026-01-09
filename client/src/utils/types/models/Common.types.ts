export type Gender = "MALE" | "FEMALE";
export type MemberStatus = 'ETUDIANT' | 'TRAVAILLEUR';

export interface District
{
  id: number;
  name: string;
}

export interface DistrictCreateRequest
{
  name: string;
}

export interface Tribute
{
  id: number;
  name: string;
}

export interface TributeCreateRequest
{
  name: string;
}