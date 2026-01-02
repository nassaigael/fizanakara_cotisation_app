import React from 'react';

// --- ENUMS ---
export type Gender = "MALE" | "FEMALE"; 
export type CotisationStatus = "Payé" | "En cours";
export type Status = 'Etudiant' | 'Travailleur';

// --- NOUVELLES INTERFACES POUR LES OBJETS BACKEND ---
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
  // Ajoute "secondary" ici
  variant?: "primary" | "secondary" | "ghost" | "danger"; 
  isActive?: boolean;
}

export interface Admin {
  id?: string;
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
 * Interface Member corrigée
 * district/tribute = Objets reçus du Backend (Affichage)
 * districtId/tributeId = IDs envoyés au Backend (Formulaire)
 */
export interface Member extends Partial<Admin> {
  status: Status;
  district?: District; 
  tribute?: Tribute;
  districtId?: number; 
  tributeId?: number;  
  cotisationStatus?: CotisationStatus;
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
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference?: string; // Utile pour le Mobile Money
}

export interface Cotisation {
  id: string;
  memberId: string;
  year: number;
  totalAmount: number;     // Montant total dû pour l'année
  amountPaid: number;      // Somme des paiements effectués
  status: "Payé" | "En cours";
  history: PaymentHistory[];
}