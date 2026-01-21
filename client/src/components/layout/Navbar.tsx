import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  AiOutlineCalendar, 
  AiOutlineUser, 
  AiOutlineThunderbolt, 
  AiOutlineMenuUnfold 
} from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext'; 

interface NavbarProps {
  onMenuClick?: () => void; // Pour ouvrir la sidebar sur mobile
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, isSuperAdmin } = useAuth();

  const today = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    });
  }, []);

  return (
    <header className="h-20 bg-white border-b-2 border-brand-border px-4 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* GAUCHE : Titre & Menu Mobile */}
      <div className="flex items-center gap-4">
        {/* Bouton Menu Mobile (Apparaît seulement sur petits écrans) */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-brand-primary text-white rounded-2xl border-b-4 border-brand-primary-dark active:border-b-0 active:translate-y-1 transition-all"
        >
          <AiOutlineMenuUnfold size={20} />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-sm lg:text-xl font-black text-brand-text uppercase tracking-tight leading-none">
            {isSuperAdmin ? "Console Maître" : "Tableau de Bord"}
          </h1>
          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-1">
            Fizanakara v2.0
          </span>
        </div>
      </div>

      {/* DROITE : Date & Profil */}
      <div className="flex items-center gap-4 lg:gap-8">
        
        {/* Date (Masquée sur mobile) */}
        <div className="hidden md:flex items-center gap-3 bg-brand-bg px-5 py-2.5 rounded-2xl border-2 border-brand-border border-b-4 font-black text-[10px] uppercase text-brand-muted tracking-widest">
          <AiOutlineCalendar size={18} className="text-brand-primary" />
          <span>{today}</span>
        </div>

        {/* Bloc Profil */}
        <Link to="/profile" className="flex items-center gap-3 lg:gap-4 pl-4 border-l-2 border-brand-border group transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] lg:text-sm font-black text-brand-text leading-none capitalize flex items-center justify-end gap-1 group-hover:text-brand-primary transition-colors">
              {isSuperAdmin && <AiOutlineThunderbolt className="text-amber-500 animate-pulse" size={14} />}
              {user?.firstName || "Administrateur"}
            </p>
            <div className="flex justify-end mt-1">
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                isSuperAdmin 
                  ? 'bg-amber-100 text-amber-600 border border-amber-200' 
                  : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
              }`}>
                {isSuperAdmin ? '👑 Super Privilège' : 'Gestionnaire'}
              </span>
            </div>
          </div>
          
          {/* Avatar avec effet 3D */}
          <div className={`w-11 h-11 lg:w-13 lg:h-13 rounded-2xl border-2 overflow-hidden flex items-center justify-center transition-all shadow-sm ${
            isSuperAdmin 
              ? 'border-amber-400 border-b-4 bg-amber-50 group-hover:rotate-3' 
              : 'border-brand-border border-b-4 bg-brand-bg group-hover:-rotate-3'
          }`}>
            {user?.imageUrl ? (
              <img src={user.imageUrl} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              <AiOutlineUser size={24} className={isSuperAdmin ? "text-amber-500" : "text-brand-muted"} />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default memo(Navbar);