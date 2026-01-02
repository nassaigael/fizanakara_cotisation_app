import { createContext } from "react";
import type { AuthContextType } from "../types/types";
import { 
  AiOutlineUser, AiOutlineSetting, AiOutlineLogout, 
   AiOutlineMessage, AiOutlineDashboard, 
  AiOutlineUsergroupAdd, AiOutlineWallet 
} from "react-icons/ai";

// --- CONTEXTE D'AUTHENTIFICATION ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- DONNÉES MÉTIER (Synchronisées avec le Backend Java) ---
export const COTISATION_STATUSES = ["Payé", "En cours", "En attente", "Impayé"] as const;

export const SITUATIONS = [
    { label: "Étudiant", value: "ETUDIANT" },
    { label: "Travailleur", value: "TRAVAILLEUR" },
    { label: "Enfant", value: "ENFANT" }
] as const;

// --- ASSETS & MÉDIAS ---
export const GITHUB_BASE_URL = "https://raw.githubusercontent.com/mekill404/image_membre_fizankara/main/";
export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Admin&background=FF4B4B&color=fff";

// --- STRUCTURE DE NAVIGATION ---
export const PROFILE_MENU = [
    { label: "Mon Profil", path: "profiles", icon: AiOutlineUser },
    { label: "Paramètres", path: "settings", icon: AiOutlineSetting },
    { label: "Messages", path: "messages", icon: AiOutlineMessage },
    { label: "Déconnexion", path: "/", icon: AiOutlineLogout, isDestructive: true },
];

export const sidebarLinks = [
  { title: "Tableau de bord", path: "/admin/dashboard", icon: AiOutlineDashboard },
  { title: "Membres", path: "/admin/member", icon: AiOutlineUsergroupAdd },
  { title: "Cotisations", path: "/admin/contributions", icon: AiOutlineWallet },
  { title: "Paramètres", path: "/admin/settings", icon: AiOutlineSetting },
] as const;

// --- SYSTÈME DE VARIANTE UI (Neubrutalism Ready) ---
export const variantStyles = {
  warning: {
    borderColor: "border-amber-500",
    titleColor: "text-amber-700",
    buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
    bgColor: "bg-amber-50"
  },
  danger: {
    borderColor: "border-red-500",
    titleColor: "text-red-700",
    buttonBg: "bg-red-600 hover:bg-red-700 text-white",
    bgColor: "bg-red-50"
  },
  success: {
    borderColor: "border-emerald-500",
    titleColor: "text-emerald-700",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    bgColor: "bg-emerald-50"
  },
  info: {
    borderColor: "border-blue-500",
    titleColor: "text-blue-700",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
    bgColor: "bg-blue-50"
  }
} as const;