import React, { useMemo, memo } from 'react';
import { AiOutlineSearch, AiOutlineBell, AiOutlineCalendar } from 'react-icons/ai';
import { useAuth } from '../../context/useAuth';
import { THEME } from '../../styles/theme';

/**
 * Navbar Component - Barre de navigation principale.
 * Gère l'affichage de l'admin connecté et la recherche globale.
 */
const Navbar: React.FC = () => {
  const { admin } = useAuth();
  
  // Memoisation de la date pour éviter de recalculer à chaque re-render
  const today = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }, []);

  // Logique d'image optimisée
  const avatarUrl = useMemo(() => {
    if (!admin?.imageUrl) return `https://ui-avatars.com/api/?name=${admin?.firstName || 'A'}&background=FF4B4B&color=fff`;
    
    if (admin.imageUrl.startsWith('http')) return admin.imageUrl;
    
    // Si c'est un ID Google Drive ou autre stockage spécifique
    return `https://lh3.googleusercontent.com/d/${admin.imageUrl}`;
  }, [admin?.imageUrl, admin?.firstName]);

  return (
    <header className="h-20 bg-white dark:bg-brand-bg border-b-2 border-brand-border px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      
      {/* RECHERCHE (Style Creusé) */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <AiOutlineSearch 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors duration-300" 
            size={20} 
          />
          <input 
            type="text" 
            placeholder="Rechercher un membre, un district..." 
            className={`
                w-full py-3 pl-12 pr-4 rounded-2xl bg-brand-bg border-2 border-brand-border border-t-brand-border-dark
                focus:bg-white focus:border-brand-primary focus:border-t-brand-primary-dark
                transition-all duration-200 outline-none placeholder-brand-muted/50
                text-sm font-bold text-brand-text
            `} 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* DATE (Badge Desktop) */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-brand-bg rounded-2xl border-2 border-brand-border text-brand-muted text-[10px] font-black uppercase tracking-widest select-none">
          <AiOutlineCalendar size={18} className="text-brand-primary" />
          <span className="mt-0.5">{today}</span>
        </div>

        {/* NOTIFICATIONS (Bouton 3D) */}
        <button className="relative p-3 bg-white dark:bg-brand-border-dark border-2 border-b-4 border-brand-border text-brand-muted hover:text-brand-primary rounded-2xl transition-all active:border-b-0 active:translate-y-1 group">
          <AiOutlineBell size={24} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2.5 w-3 h-3 bg-brand-primary rounded-full border-2 border-white dark:border-brand-border-dark"></span>
        </button>

        {/* PROFIL ADMIN */}
        <div className="flex items-center gap-4 pl-6 border-l-2 border-brand-border">
          <div className="hidden sm:block text-right">
            <p className={`text-sm ${THEME.font.black} text-brand-text dark:text-white leading-none capitalize`}>
              {admin?.firstName || "Chargement..."}
            </p>
            <p className="text-[9px] text-brand-primary font-black mt-1.5 uppercase tracking-tighter">
              Administrateur
            </p>
          </div>
          
          {/* Avatar avec effet 3D */}
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-b-4 border-brand-border overflow-hidden active:scale-95 transition-transform cursor-pointer shadow-sm">
            <img 
              src={avatarUrl} 
              className="w-full h-full object-cover" 
              alt="profile"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=Admin&background=FF4B4B&color=fff`;
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);