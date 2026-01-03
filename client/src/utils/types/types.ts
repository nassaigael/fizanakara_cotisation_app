import React from 'react';

// --- ENUMS & LITERAL TYPES ---
// Utilisation de types littéraux pour une validation stricte
export type Gender = "MALE" | "FEMALE"; 
export type CotisationStatus = "Payé" | "En cours";
export type Status = 'ETUDIANT' | 'TRAVAILLEUR' | 'ENFANT'; 
export type PaymentMethod = "Liquide" | "MVola" | "Orange Money" | "Airtel Money" | "Virement";
export type UIVariant = "success" | "warning" | "info" | "danger";

// --- BASE DE SÉCURITÉ (Mapped Superclass Logic) ---
/**
 * Interface mère pour garantir que tout utilisateur (Admin ou Membre)
 * possède les checks de base requis par le backend.
 */
export interface UserBase {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Gender;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- INTERFACES BACKEND (Localisation & Structure) ---
export interface District {
  id: number;
  name: string;
}

export interface Tribute {
  id: number;
  name: string;
}

// --- ADMIN & AUTHENTIFICATION ---
/**
 * Admin hérite de UserBase. 
 * On ajoute les champs spécifiques à la gestion.
 */
export interface Admin extends UserBase {
  sequenceNumber?: number;
  birthDate: string;
  verified: boolean;
  role?: 'ADMIN' | 'SUPER_ADMIN';
}

// Alias pour la compatibilité avec tes services existants
export type AdminResponse = Admin;

export interface UpdateAdminDto extends Partial<Omit<Admin, 'id' | 'sequenceNumber' | 'createdAt'>> {
  password?: string; // Ajouté pour le changement de mot de passe sécurisé
}

// --- MEMBRES & PAIEMENTS ---
export interface PaymentHistory {
  id: string | number;
  amount: number;
  date: string;
  year: number; // Important pour le filtrage du Dashboard
  method?: PaymentMethod;
  reference?: string; 
  status?: string;
}

/**
 * Member hérite aussi de UserBase.
 * On utilise l'héritage pour éviter de redéfinir nom, email, etc.
 */
export interface Member extends UserBase {
  status: Status;
  birthDate?: string;
  district?: District; 
  tribute?: Tribute;
  districtId?: number; 
  tributeId?: number;  
  cotisationStatus?: CotisationStatus;
  payments: PaymentHistory[]; 
}

// --- UI COMPONENTS PROPS ---
export interface AlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: UIVariant; 
}

export interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    type?: string;
    name?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    error?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  to?: string; // Pour les liens de navigation
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success"; 
  isActive?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: React.ElementType; // Utilise le type de composant d'icône (lucide ou react-icons)
  color: 'red' | 'blue' | 'green' | 'yellow';
}

// --- CONTEXTS & API RESPONSES ---
export interface AuthResponse {
  user: Admin;          
  accessToken: string;   
  refreshToken: string;
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (userData: Admin) => Promise<any>;
  logout: () => void;
  updateAdminState: (updatedAdmin: Admin) => void;
}

/**
 * Type utilitaire pour la création de membre (Formulaire)
 * On retire ce qui est généré par le serveur (ID) et on aplatit les objets complexes
 */
export type MemberFormInput = Omit<Member, 'id' | 'district' | 'tribute' | 'payments' | 'createdAt'> & {
  districtName?: string;
  tributeName?: string;
};