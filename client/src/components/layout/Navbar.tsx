import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineCalendar } from 'react-icons/ai';
import { useAuth } from '../../context/useAuth'; 
import { THEME } from '../../styles/theme';
import { getImageUrl } from '../../utils/constants/constants';

const Navbar: React.FC = () => {
  // On récupère l'admin global depuis le contexte
  const { admin } = useAuth();
  
  const today = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }, []);

  // ✅ CORRECTION : On ajoute un timestamp (?t=...) pour forcer le navigateur à recharger l'image
  const avatarUrl = useMemo(() => {
    const url = getImageUrl(admin?.imageUrl, admin?.firstName);
    // Si l'url contient déjà un '?', on ajoute &t, sinon ?t
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
  }, [admin]); // Recalculé dès que l'objet admin change dans le contexte

  return (
    <header className="h-20 bg-white border-b-2 border-brand-border px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* RECHERCHE */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <AiOutlineSearch 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" 
            size={20} 
          />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full py-3 pl-12 pr-4 rounded-2xl bg-brand-bg border-2 border-brand-border outline-none font-bold text-sm" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* DATE */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-brand-bg rounded-2xl border-2 border-brand-border text-brand-muted text-[10px] font-black uppercase tracking-widest">
          <AiOutlineCalendar size={18} className="text-brand-primary" />
          <span>{today}</span>
        </div>

        {/* SECTION PROFIL */}
        <Link 
          to="/admin/profile" 
          className="flex items-center gap-4 pl-6 border-l-2 border-brand-border hover:opacity-80 transition-all group"
        >
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
              // ✅ La clé 'key' force React à reconstruire la balise img au changement d'URL
              key={avatarUrl}
              src={avatarUrl} 
              className="w-full h-full object-cover" 
              alt="avatar"
              onError={(e) => {
                // Si l'image GitHub échoue, on met les initiales
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${admin?.firstName || 'Admin'}&background=FF4B4B&color=fff`;
              }}
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

// On retire memo() pour s'assurer que le composant réagit bien au contexte
export default Navbar;