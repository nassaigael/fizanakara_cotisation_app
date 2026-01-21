import React, { useState, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  AiOutlineLogout, AiOutlineDashboard, AiOutlineSetting, 
  AiOutlineTeam, AiOutlineGlobal, AiOutlineDollar
} from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import Alert from '../shared/Alert';

const sidebarLinks = [
  { title: 'Dashboard', path: '/dashboard', icon: AiOutlineDashboard },
  { title: 'Membres', path: '/members', icon: AiOutlineTeam },
  { title: 'Cotisations', path: '/contributions', icon: AiOutlineDollar },
];

const Sidebar: React.FC = () => {
  const { logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-72 h-screen bg-white border-r-2 border-brand-border flex-col sticky top-0 z-40">
        {/* Logo & Branding */}
        <div className="p-8 flex items-center gap-4">
          <div className="bg-brand-primary w-12 h-12 rounded-2xl flex items-center justify-center text-white border-b-4 border-brand-primary-dark shrink-0 shadow-lg">
            <AiOutlineGlobal size={28} className="animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-brand-text leading-tight uppercase tracking-tighter">
              FIZANA<span className="text-brand-primary">KARA</span>
            </span>
            <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">
              {isSuperAdmin ? "👑 Console Maître" : "Gestionnaire"}
            </span>
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `group flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all border-2 ${
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

          {/* Section SUPERADMIN (Lien Unique vers Management) */}
          {isSuperAdmin && (
            <div className="pt-4 mt-4 border-t-2 border-brand-bg">
              <NavLink 
                to="/management" 
                className={({ isActive }) => 
                  `flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all border-2 ${
                    isActive 
                    ? 'bg-amber-50 text-amber-600 border-amber-500 border-b-4' 
                    : 'text-brand-muted hover:bg-brand-bg border-transparent'
                  }`
                }
              >
                <AiOutlineSetting size={22} />
                <span>Gestion Système</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer Sidebar : Déconnexion */}
        <div className="p-6 border-t-2 border-brand-border bg-gray-50/50">
          <button 
            onClick={() => setIsLogoutAlertOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-4 text-brand-muted hover:text-brand-primary rounded-2xl font-black text-[11px] uppercase border-2 border-transparent hover:border-brand-primary hover:border-b-4 transition-all group"
          >
            <AiOutlineLogout size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-brand-border z-50 px-2 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-20">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                  isActive ? 'text-brand-primary scale-110' : 'text-brand-muted'
                }`
              }
            >
              <link.icon size={24} />
              <span className="text-[8px] font-black uppercase tracking-tighter">{link.title}</span>
            </NavLink>
          ))}
          
          {/* Option Management sur Mobile pour SuperAdmin */}
          {isSuperAdmin && (
             <NavLink
             to="/management"
             className={({ isActive }) => 
               `flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                 isActive ? 'text-amber-500 scale-110' : 'text-brand-muted'
               }`
             }
           >
             <AiOutlineSetting size={24} />
             <span className="text-[8px] font-black uppercase tracking-tighter">Système</span>
           </NavLink>
          )}
          
          <button 
            onClick={() => setIsLogoutAlertOpen(true)} 
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-brand-muted"
          >
            <AiOutlineLogout size={24} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Quitter</span>
          </button>
        </div>
      </nav>

      {/* Alerte de déconnexion */}
      <Alert 
        isOpen={isLogoutAlertOpen}
        title="Quitter la session ?"
        message="Vous devrez vous reconnecter pour accéder au panel Fizanakara."
        variant="danger"
        onClose={() => setIsLogoutAlertOpen(false)}
        onConfirm={() => { logout(); navigate('/login'); }}
        confirmText="Se déconnecter"
      />
    </>
  );
};

export default memo(Sidebar);