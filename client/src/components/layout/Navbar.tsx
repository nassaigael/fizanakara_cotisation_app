import React, { useMemo, memo } from 'react';
import { AiOutlineSearch, AiOutlineCalendar } from 'react-icons/ai';
import { useAuth } from '../../context/useAuth'; // Vérifie que c'est le bon chemin
import { THEME } from '../../styles/theme';
import { getImageUrl } from '../../utils/constants/constants';

const Navbar: React.FC = () => {
  const { admin } = useAuth();
  
  const today = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    });
  }, []);

  // On utilise notre utilitaire centralisé
  const avatarUrl = useMemo(() => {
    return getImageUrl(admin?.imageUrl, admin?.firstName);
  }, [admin?.imageUrl, admin?.firstName]);

  return (
    <header className="h-20 bg-white border-b-2 border-brand-border px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* BARRE DE RECHERCHE */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un membre..." 
            className="w-full py-3 pl-12 pr-4 rounded-2xl bg-brand-bg border-2 border-brand-border focus:bg-white focus:border-brand-primary transition-all outline-none font-bold text-sm" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* DATE */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-brand-bg rounded-2xl border-2 border-brand-border text-brand-muted text-[10px] font-black uppercase tracking-widest">
          <AiOutlineCalendar size={18} className="text-brand-primary" />
          <span>{today}</span>
        </div>

        {/* PROFIL */}
        <div className="flex items-center gap-4 pl-6 border-l-2 border-brand-border">
          <div className="text-right">
            <p className={`text-sm ${THEME.font.black} text-brand-text leading-none capitalize`}>
              {admin?.firstName || "Admin"}
            </p>
            <p className="text-[9px] text-brand-primary font-black mt-1 uppercase">
              Gestionnaire
            </p>
          </div>
          
          <div className="w-12 h-12 rounded-2xl border-2 border-b-4 border-brand-border overflow-hidden bg-brand-bg">
            <img 
              src={avatarUrl} 
              className="w-full h-full object-cover" 
              alt="avatar"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=Admin&background=FF4B4B`;
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);