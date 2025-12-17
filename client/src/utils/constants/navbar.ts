import { AiOutlineUser, AiOutlineSetting, AiOutlineLogout, AiOutlineInbox, AiOutlineMessage } from "react-icons/ai";

export const PROFILE_MENU = [
    { label: "Mon Profil", path: "profiles", icon: AiOutlineUser },
    { label: "Paramètres", path: "settings", icon: AiOutlineSetting },
    { label: "Mon Profil", path: "inbox", icon: AiOutlineInbox },
    { label: "Paramètres", path: "messages", icon: AiOutlineMessage },
    { label: "Déconnexion", path: "/", icon: AiOutlineLogout, isDestructive: true },
];