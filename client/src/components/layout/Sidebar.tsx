import React, { useState, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { sidebarLinks } from '../../utils/constants/constants';
import { useAuth } from '../../context/useAuth';
import { THEME } from '../../styles/theme';
import Alert from '../ui/Alert'; // On utilise notre composant réutilisable

/**
 * Sidebar Component - Menu de navigation latéral.
 * Intègre la déconnexion sécurisée via le composant Alert.
 */
const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <aside className="w-72 h-screen bg-white dark:bg-brand-bg border-r-2 border-brand-border flex flex-col sticky top-0 transition-colors z-40">
        
        {/* LOGO SECTION */}
        <div className="p-8 flex items-center gap-4">
          <div className="bg-brand-primary w-12 h-12 rounded-2xl flex items-center justify-center text-white border-b-4 border-brand-primary-dark shrink-0">
            <AiOutlineUser size={28} />
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl ${THEME.font.black} text-brand-primary leading-none`}>
              Fizanakara
            </span>
            <span className={`text-[10px] ${THEME.font.black} text-brand-muted mt-1 uppercase tracking-widest`}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-5 py-4 rounded-2xl ${THEME.font.black} text-[11px] uppercase tracking-wider transition-all border-2 ${
                  isActive 
                  ? 'bg-brand-primary/10 text-brand-primary border-brand-primary border-b-4 translate-y-0.5' 
                  : 'text-brand-muted hover:bg-brand-bg hover:text-brand-text border-transparent'
                }`
              }
            >
              <link.icon size={24} className="shrink-0 transition-transform group-hover:scale-110" />
              <span>{link.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER : LOGOUT */}
        <div className="p-6 border-t-2 border-brand-border">
          <button 
            onClick={() => setIsLogoutAlertOpen(true)}
            className={`w-full flex items-center justify-center gap-3 py-4 text-brand-muted hover:text-brand-primary rounded-2xl ${THEME.font.black} text-[11px] uppercase border-2 border-transparent hover:border-brand-primary hover:border-b-4 active:translate-y-1 active:border-b-0 transition-all group`}
          >
            <AiOutlineLogout size={22} className="group-hover:rotate-12 transition-transform" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ALERTE DE DÉCONNEXION */}
      <Alert 
        isOpen={isLogoutAlertOpen}
        title="Déconnexion"
        message="Voulez-vous vraiment quitter la session d'administration ?"
        variant="danger"
        confirmText="Se déconnecter"
        onClose={() => setIsLogoutAlertOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default memo(Sidebar);