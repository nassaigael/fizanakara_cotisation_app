import React, { useState, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  AiOutlineLogout, AiOutlineDashboard, AiOutlineSetting, 
  AiOutlineUserAdd, AiOutlineTeam, AiOutlineDown, AiOutlineGlobal 
} from 'react-icons/ai';
import { sidebarLinks } from '../../utils/constants/constants';
import { useAuth } from '../../context/useAuth';
import { THEME } from '../../styles/theme';
import Alert from '../ui/Alert';

const Sidebar: React.FC = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const isSuperAdmin = admin?.role?.toUpperCase() === 'SUPERADMIN';

  return (
    <>
      <aside className="hidden lg:flex w-72 h-screen bg-white border-r-2 border-brand-border flex-col sticky top-0 z-40">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-brand-primary w-12 h-12 rounded-2xl flex items-center justify-center text-white border-b-4 border-brand-primary-dark shrink-0 shadow-lg">
            <AiOutlineDashboard size={28} />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl ${THEME.font.black} text-brand-primary leading-tight uppercase`}>SENTINELLE</span>
            <span className="text-[10px] font-black text-brand-muted uppercase tracking-tighter">
              {isSuperAdmin ? "👑 Console Maître" : "Gestion Cotisation"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `group flex items-center gap-4 px-6 py-4 rounded-2xl ${THEME.font.black} text-[11px] uppercase tracking-wider transition-all border-2 ${
                  isActive 
                  ? 'bg-brand-primary/5 text-brand-primary border-brand-primary border-b-4 translate-y-0.5' 
                  : 'text-brand-muted hover:bg-brand-bg hover:text-brand-text border-transparent'
                }`
              }
            >
              <link.icon size={22} className="shrink-0 transition-transform group-hover:scale-110" />
              <span>{link.title}</span>
            </NavLink>
          ))}

          {isSuperAdmin && (
            <div className="pt-4 mt-4 border-t-2 border-brand-bg">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl ${THEME.font.black} text-[11px] uppercase tracking-wider text-brand-text hover:bg-brand-bg transition-all`}
              >
                <div className="flex items-center gap-4">
                  <AiOutlineSetting size={22} className="text-amber-500" />
                  <span>Outils Système</span>
                </div>
                <AiOutlineDown className={`transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <NavLink to="/admin/manage-admins" className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-brand-muted hover:text-amber-600 transition-colors">
                    <AiOutlineUserAdd size={18} /> GESTION ADMINS
                  </NavLink>
                  <NavLink to="/admin/manage-districts" className="flex items-center gap-3 px-6 py-3 text-[10px] font-black text-brand-muted hover:text-amber-600 transition-colors">
                    <AiOutlineGlobal size={18} />DISTRICTS & TRIBUTE
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="p-6 border-t-2 border-brand-border bg-gray-50/50">
          <button 
            onClick={() => setIsLogoutAlertOpen(true)}
            className={`w-full flex items-center justify-center gap-3 py-4 text-brand-muted hover:text-brand-primary rounded-2xl ${THEME.font.black} text-[11px] uppercase border-2 border-transparent hover:border-brand-primary hover:border-b-4 transition-all group`}
          >
            <AiOutlineLogout size={22} className="group-hover:rotate-12 transition-transform" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-brand-border z-50 px-2 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-20">
          {sidebarLinks.slice(0, 3).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                  isActive ? 'text-brand-primary' : 'text-brand-muted'
                }`
              }
            >
              <link.icon size={22} />
              <span className="text-[8px] font-black uppercase tracking-tighter">{link.title.split(' ')[0]}</span>
            </NavLink>
          ))}
          
          {isSuperAdmin && (
              <NavLink to="/admin/manage-admins" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-amber-500' : 'text-brand-muted'}`}>
                <AiOutlineSetting size={22} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Outils</span>
              </NavLink>
          )}

          <button onClick={() => setIsLogoutAlertOpen(true)} className="flex flex-col items-center justify-center w-full h-full gap-1 text-brand-muted">
            <AiOutlineLogout size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Quitter</span>
          </button>
        </div>
      </nav>

      <Alert 
        isOpen={isLogoutAlertOpen}
        title="Déconnexion"
        message="Voulez-vous vraiment quitter la session ?"
        variant="danger"
        onClose={() => setIsLogoutAlertOpen(false)}
        onConfirm={() => { logout(); navigate('/login'); }}
      />
    </>
  );
};

export default memo(Sidebar);