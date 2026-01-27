import React, { useState, memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlineSetting,
  AiOutlineTeam,
  AiOutlineGlobal,
  AiOutlineDollar,
} from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import { THEME } from "../../styles/theme";
import Alert from "../shared/Alert";

const sidebarLinks = [
  { title: "Dashboard", path: "/dashboard", icon: AiOutlineDashboard },
  { title: "Membres", path: "/members", icon: AiOutlineTeam },
  { title: "Cotisations", path: "/cotisations", icon: AiOutlineDollar },
];

const Sidebar: React.FC = () => {
  const { logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [openLogout, setOpenLogout] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex w-72 h-screen bg-white border-r-2 border-brand-border flex-col sticky top-0">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center border-b-4 border-brand-primary-dark">
            <AiOutlineGlobal size={26} />
          </div>
          <div>
            <p className={THEME.font.black}>Fizanakara</p>
            <span className={THEME.font.mini}>
              {isSuperAdmin ? "Console Maître" : "Gestionnaire"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-xl border-2 transition-all
                ${isActive ? "bg-brand-primary/10 text-brand-primary border-brand-primary border-b-4" : "border-transparent text-brand-muted hover:bg-brand-bg"}`
              }
            >
              <link.icon size={20} />
              <span className={THEME.font.mini}>{link.title}</span>
            </NavLink>
          ))}
          {isSuperAdmin && (
            <NavLink
              to="/management"
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-xl border-2 mt-6 transition-all
                ${isActive ? "bg-amber-50 text-amber-600 border-amber-500 border-b-4" : "border-transparent text-brand-muted hover:bg-brand-bg"}`
              }
            >
              <AiOutlineSetting size={20} />
              <span className={THEME.font.mini}>Système</span>
            </NavLink>
          )}
        </nav>

        <div className="p-6 border-t-2 border-brand-border">
          <button onClick={() => setOpenLogout(true)} className={`${THEME.buttonSecondary} w-full flex items-center justify-center gap-2`}>
            <AiOutlineLogout size={18} /> Déconnexion
          </button>
        </div>
      </aside>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-brand-border h-20 px-4 flex items-center justify-around z-50">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-brand-primary scale-110" : "text-brand-muted"}`}
          >
            <link.icon size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{link.title}</span>
          </NavLink>
        ))}
        {isSuperAdmin && (
          <NavLink
            to="/management"
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? "text-amber-600 scale-110" : "text-brand-muted"}`}
          >
            <AiOutlineSetting size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Système</span>
          </NavLink>
        )}
        <button onClick={() => setOpenLogout(true)} className="flex flex-col items-center gap-1 text-brand-muted">
          <AiOutlineLogout size={22} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Quitter</span>
        </button>
      </nav>

      <Alert
        isOpen={openLogout}
        variant="danger"
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        onClose={() => setOpenLogout(false)}
        onConfirm={() => { logout(); navigate("/login"); }}
      />
    </>
  );
};

export default memo(Sidebar);