// src/utils/types/index.ts

import React from 'react';

// --- ENUMS ---
export type Gender = "MALE" | "FEMELLE"; 
export type CotisationStatus = "Payé" | "En cours" | "En attente" | "Impayé";
export type Status = 'Étudiant' | 'Travailleur';

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
  variant?: "primary" | "ghost" | "danger";
  isActive?: boolean;
}

// --- DOMAINE (Respect strict des colonnes SQL / Entités Java) ---

/**
 * Interface Admin : Correspond à la table "admins" et la super-classe "users"
 */
export interface Admin {
  id: string;
  email: string;
  password?: string; // Optionnel car souvent masqué par le backend
  verified: boolean;
  // Champs hérités de la table "users" (snake_case)
  sequence_number: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: Gender;
  image_url: string;
  phone_number: string;
  created_at: string;
}

/**
 * Interface Member : Correspond à la table "members"
 */
export interface Member {
  id: string;
  status: Status;
  district_id: number; // Foreign Key
  tribute_id: number;  // Foreign Key
  // Champs hérités de la table "users"
  sequence_number: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: Gender;
  image_url: string;
  phone_number: string;
  created_at: string;
  cotisationStatus?: CotisationStatus;
}

// --- AUTHENTIFICATION ---

/**
 * Doit matcher les clés de la Map renvoyée par AdminsAuthController.java
 */
export interface AuthResponse {
    user: Admin;          // La clé dans Map.of("user", admin)
    accessToken: string;   // La clé dans Map.of("accessToken", token)
    refreshToken: string;
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (email: string, pass: string, remember: boolean) => Promise<void>;
  logout: () => void;
}
// src/utils/types.ts (ou le fichier correspondant)

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean; // <--- AJOUTE CETTE LIGNE
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}