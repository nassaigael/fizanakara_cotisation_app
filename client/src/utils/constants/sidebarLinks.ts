import { 
  AiOutlineDashboard, 
  AiOutlineUsergroupAdd, 
  AiOutlineWallet, 
  AiOutlineSetting 
} from "react-icons/ai";

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