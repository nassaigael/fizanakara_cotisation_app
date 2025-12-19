import { createContext } from "react";
import type { AuthContextType } from "../types/types"; // Ton fichier de types regroupé
import { 
  AiOutlineUser, 
  AiOutlineSetting, 
  AiOutlineLogout, 
  AiOutlineInbox, 
  AiOutlineMessage,
  AiOutlineDashboard, 
  AiOutlineUsergroupAdd, 
  AiOutlineWallet 
} from "react-icons/ai";

// --- CONTEXTE ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- DONNÉES MÉTIER ---
export const TRIBES = [
    "Merina", "Betsileo", "Bara", "Antaisaka", "Saklava", "Antandroy", "Betsimisaraka"
];

export const COTISATION_STATUSES = [
    "Payé", "En cours", "En attente", "Impayé"
];

// Corrélation avec le MemberStatusEnum du Backend
export const SITUATIONS = [
    { label: "Étudiant", value: "ETUDIANT" },
    { label: "Travailleur", value: "TRAVAILLEUR" },
    { label: "Enfant", value: "ENFANT" }
];

// --- NAVIGATION ---
export const PROFILE_MENU = [
    { label: "Mon Profil", path: "profiles", icon: AiOutlineUser },
    { label: "Paramètres", path: "settings", icon: AiOutlineSetting },
    { label: "Boîte de réception", path: "inbox", icon: AiOutlineInbox },
    { label: "Messages", path: "messages", icon: AiOutlineMessage },
    { label: "Déconnexion", path: "/", icon: AiOutlineLogout, isDestructive: true },
];

export const sidebarLinks = [
  {
    title: "Tableau de bord",
    path: "/admin/dashboard",
    icon: AiOutlineDashboard,
  },
  {
    title: "Membres",
    path: "/admin/member",
    icon: AiOutlineUsergroupAdd,
  },
  {
    title: "Cotisations",
    path: "/admin/contributions",
    icon: AiOutlineWallet,
  },
  {
    title: "Paramètres",
    path: "/admin/settings",
    icon: AiOutlineSetting,
  },
];

// --- STYLES UI ---
export const variantStyles = {
  warning: {
    borderColor: "border-amber-500",
    titleColor: "text-amber-700",
    buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  danger: {
    borderColor: "border-red-500",
    titleColor: "text-red-700",
    buttonBg: "bg-red-600 hover:bg-red-700 text-white",
  },
  success: {
    borderColor: "border-emerald-500",
    titleColor: "text-emerald-700",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  info: {
    borderColor: "border-blue-500",
    titleColor: "text-blue-700",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
  }
} as const; // "as const" permet à TS de verrouiller les valeurs comme des constantes