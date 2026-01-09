import type { Gender } from "./Common.types";

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface RegisterRequestDTO {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;    
    imageUrl: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface AdminResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    imageUrl: string;
    phoneNumber: string;
    email: string;
    verified: boolean;
    createdAt: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        gender: string;
    };
    accessToken: string;
    refreshToken: string;
}