import React from 'react';

// --- ENUMS ---
export type Gender = "MALE" | "FEMALE"; 
export type CotisationStatus = "Payé" | "En cours";
export type Status = 'Etudiant' | 'Travailleur';

// --- INTERFACES BACKEND ---
export interface District {
  id: number;
  name: string;
}

export interface Tribute {
  id: number;
  name: string;
}

// --- INTERFACES UI ---
export interface AlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "success" | "warning" | "info" | "danger"; 
}

export interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    icon?: React.ReactElement;
    name?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  to?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger"; 
  isActive?: boolean;
  disabled?: boolean; // ✅ CORRIGÉ : Ajout du "?" pour le rendre optionnel
}
// 1. Modifie d'abord l'interface Admin pour accepter les deux types d'ID
export interface Admin {
  id?: string | number; // Ajout de "number" ici pour la compatibilité
  sequenceNumber?: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  imageUrl: string;
  phoneNumber: string;
  verified?: boolean;
}

/**
 * 2. L'interface Member peut maintenant hériter sans conflit
 */
export interface Member extends Partial<Admin> {
  id: string | number; // Désormais compatible avec Admin
  status: Status;
  district?: District; 
  tribute?: Tribute;
  districtId?: number; 
  tributeId?: number;  
  cotisationStatus?: CotisationStatus;
  payments?: PaymentHistory[]; 
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<void>;
  register: (userData: Admin) => Promise<any>;
  logout: () => void;
}

export interface AuthResponse {
    user: Admin;          
    accessToken: string;   
    refreshToken: string;
}

export type PaymentMethod = "Liquide" | "MVola" | "Orange Money" | "Airtel Money" | "Virement";

export interface PaymentHistory {
  id: string | number;
  amount: number;
  date: string;
  method?: PaymentMethod;
  reference?: string; 
}



export type MemberFormInput = Omit<Member, 'id' | 'district' | 'tribute'> & {
    districtName: string;
    tributeName: string;
};