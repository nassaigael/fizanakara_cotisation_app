import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineUser, AiOutlineThunderbolt, AiOutlineDashboard } from 'react-icons/ai';
import { useAuth } from '../../context/useAuth'; 
import { THEME } from '../../styles/theme';
import { getImageUrl } from '../../utils/constants/constants';

const Navbar: React.FC = () => {
  const { admin } = useAuth();
  const isSuperAdmin = admin?.role === 'SUPERADMIN';

  const today = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    });
  }, []);

  const avatarUrl = useMemo(() => {
    const url = getImageUrl(admin?.imageUrl, admin?.firstName, 'admin');
    return `${url}?t=${new Date().getTime()}`;
  }, [admin]);

  return (
    <header className="h-16 lg:h-20 bg-white border-b-2 border-brand-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex-1 flex items-center gap-3">
        <div className="lg:hidden bg-brand-primary w-10 h-10 rounded-xl flex items-center justify-center text-white border-b-2 border-brand-primary-dark shadow-sm">
            <AiOutlineDashboard size={20} />
        </div>
        
        <div className="flex items-center gap-2">
          <h1 className={`text-sm lg:text-xl ${THEME.font.black} text-brand-text uppercase tracking-tight`}>
            {isSuperAdmin ? "Console Maître" : "Tableau de Bord"}
          </h1>
          {isSuperAdmin && (
            <span className="hidden sm:block bg-amber-100 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
              LIVE
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="hidden lg:flex items-center gap-2 bg-brand-bg px-4 py-2 rounded-2xl border-2 border-brand-border font-bold text-[10px] uppercase text-brand-muted tracking-widest">
          <AiOutlineCalendar size={18} className="text-brand-primary" />
          <span>{today}</span>
        </div>

        <Link to="/admin/profile" className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-6 border-l-2 border-brand-border hover:opacity-80 transition-all group">
          <div className="text-right hidden sm:block">
            <p className={`text-[11px] lg:text-sm ${THEME.font.black} text-brand-text leading-none capitalize flex items-center justify-end gap-1`}>
              {isSuperAdmin && <AiOutlineThunderbolt className="text-amber-500" size={14} />}
              {admin?.firstName || "Admin"}
            </p>
            <p className={`text-[8px] lg:text-[9px] font-black mt-1 uppercase tracking-tighter ${isSuperAdmin ? 'text-amber-600' : 'text-brand-primary'}`}>
              {isSuperAdmin ? '👑 Super Privilège' : 'Gestionnaire'}
            </p>
          </div>
          
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl border-2 overflow-hidden flex items-center justify-center transition-all ${
            isSuperAdmin 
              ? 'border-amber-400 border-b-4 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
              : 'border-brand-border border-b-4 bg-brand-bg'
          }`}>
            {admin?.imageUrl ? (
              <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" />
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