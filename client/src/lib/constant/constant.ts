import { createContext } from "react";
import { 
  AiOutlineUser, AiOutlineSetting, AiOutlineLogout, 
  AiOutlineMessage, AiOutlineDashboard, 
  AiOutlineUsergroupAdd, AiOutlineWallet 
} from "react-icons/ai";
import { MemberStatus, ContributionStatus } from "../../lib/types/models/common.type";

// Context Auth (à adapter selon votre AuthContextType)
export const AuthContext = createContext<any>(undefined);

/**
 * Statuts des cotisations basés sur le backend
 * Traduction visuelle pour l'interface
 */
export const COTISATION_UI_STATUS = {
    PAID: { label: "Payé", color: "text-green-600", bg: "bg-green-50" },
    PENDING: { label: "En attente", color: "text-amber-600", bg: "bg-amber-50" },
    PARTIAL: { label: "Partiel", color: "text-blue-600", bg: "bg-blue-50" },
    OVERDUE: { label: "En retard", color: "text-red-600", bg: "bg-red-50" },
};

/**
 * Situations/Status des membres basés sur MemberStatus
 */
export const SITUATIONS = [
    { label: "Étudiant", value: "STUDENT" as MemberStatus },
    { label: "Travailleur", value: "WORKER" as MemberStatus }
] as const;

// Configuration GitHub pour les images
const GITHUB_ACCOUNT = "mekill404";
const REPO_NAME = "image_membre_fizankara";

export const GITHUB_BASE_URL_ADMIN = `https://raw.githubusercontent.com/${GITHUB_ACCOUNT}/${REPO_NAME}/main/admin`;
export const GITHUB_BASE_URL_MEMBER = `https://raw.githubusercontent.com/${GITHUB_ACCOUNT}/${REPO_NAME}/main/membre`;
export const GITHUB_BASE_URL_ASSETS_IMAGES = `https://raw.githubusercontent.com/${GITHUB_ACCOUNT}/${REPO_NAME}/main/assets/images`;

/**
 * Générateur d'URL d'image intelligent
 */
export const getImageUrl = (
  imagePath: string | null | undefined, 
  nameForAvatar?: string,
  category: 'admin' | 'member' | 'assets' = 'member'
): string => {
  if (!imagePath || imagePath.trim() === "") {
    const initials = nameForAvatar ? encodeURIComponent(nameForAvatar) : "User";
    return `https://ui-avatars.com/api/?name=${initials}&background=FF4B4B&color=fff&bold=true`;
  }

  if (imagePath.startsWith('http')) return imagePath;

  let cleanPath = imagePath.trim().replace(/\s+/g, '_');
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasExtension = extensions.some(ext => cleanPath.toLowerCase().endsWith(ext));

  if (!hasExtension) {
      cleanPath += '.jpg';
  }

  const baseUrls = {
    admin: GITHUB_BASE_URL_ADMIN,
    member: GITHUB_BASE_URL_MEMBER,
    assets: GITHUB_BASE_URL_ASSETS_IMAGES
  };

  return `${baseUrls[category]}/${cleanPath}`;
};

export const PROFILE_MENU = [
    { label: "Mon Profil", path: "profiles", icon: AiOutlineUser },
    { label: "Paramètres", path: "settings", icon: AiOutlineSetting },
    { label: "Messages", path: "messages", icon: AiOutlineMessage },
    { label: "Déconnexion", path: "/", icon: AiOutlineLogout, isDestructive: true },
];

export const sidebarLinks = [
  { title: "Tableau de bord", path: "/admin/dashboard", icon: AiOutlineDashboard },
  { title: "Membres", path: "/admin/members", icon: AiOutlineUsergroupAdd },
  { title: "Cotisations", path: "/admin/cotisations", icon: AiOutlineWallet },
  { title: "Paramètres", path: "/admin/settings", icon: AiOutlineSetting },
] as const;

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