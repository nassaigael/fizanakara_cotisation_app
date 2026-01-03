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
export const COTISATION_STATUSES = ["Payé", "En cours"] as const;

export const SITUATIONS = [
    { label: "Étudiant", value: "ETUDIANT" },
    { label: "Travailleur", value: "TRAVAILLEUR" },
    { label: "Enfant", value: "ENFANT" }
] as const;

// --- ASSETS & MÉDIAS ---: Donc le repos doivent être public donc tous le monde peut acceder et le modifier. c'est pas bon::: Solution à trouver
export const GITHUB_BASE_URL_ADMIN = "https://raw.githubusercontent.com/mekill404/image_membre_fizankara/main/admin"// tous les photos des admin doivent être dans ce repos de format 4x4
export const GITHUB_BASE_URL_MEMBER = "https://raw.githubusercontent.com/mekill404/image_membre_fizankara/main/membre"; // tous les photos des membres doivent être dans ce repos de format 4x4 ;
export const GITHUB_BASE_URL_ASSETS_IMAGES = "https://raw.githubusercontent.com/mekill404/image_membre_fizankara/main/assets/images";// utiliser cette liens pour stocker tous les images utiliser sauf les deux categories dans l'application
export const GITHUB_BASE_URL_ASSETS_VIDEO = "https://raw.githubusercontent.com/mekill404/image_membre_fizankara/main/assets/videos";// utiliser cette liens pour stocker tous les vidéo utiliser dans l'application

export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Admin&background=FF4B4B&color=fff";
  
/**
 * Construit l'URL de l'image selon la catégorie.
 * @param category - 'admin' | 'member' | 'assets'
 */
export const getImageUrl = (
  imagePath: string | null | undefined, 
  nameForAvatar?: string,
  category: 'admin' | 'member' | 'assets' = 'member'
): string => {
  if (!imagePath || imagePath.trim() === "") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar || 'Admin')}&background=FF4B4B&color=fff&bold=true`;
  }

  if (imagePath.startsWith('http')) return imagePath;

  const baseUrls = {
    admin: GITHUB_BASE_URL_ADMIN,
    member: GITHUB_BASE_URL_MEMBER,
    assets: GITHUB_BASE_URL_ASSETS_IMAGES
  };

  return `${baseUrls[category]}/${imagePath}`;
};

// --- STRUCTURE DE NAVIGATION ---
export const PROFILE_MENU = [
    { label: "Mon Profil", path: "profiles", icon: AiOutlineUser },
    { label: "Paramètres", path: "settings", icon: AiOutlineSetting },
    { label: "Messages", path: "messages", icon: AiOutlineMessage },// fonctionnalité à rajouter pour effectuer l'envoye multiple des messages à tous les membre en un seul fois
    { label: "Déconnexion", path: "/", icon: AiOutlineLogout, isDestructive: true },
];

// chifrer les trafic entre tous ces liens
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