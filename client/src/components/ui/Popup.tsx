import React, { useEffect, memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  AiOutlineClose, AiOutlinePhone, AiOutlineEnvironment, 
  AiOutlineCalendar, AiOutlineTeam, AiOutlineIdcard 
} from "react-icons/ai";
import { THEME } from '../../styles/theme';

/**
 * MemberDetailsPopup - Affiche les informations complètes d'un membre.
 * Utilise un Portal pour s'afficher au-dessus de la Sidebar et Navbar.
 */
const Popup: React.FC<{ isOpen: boolean; member: any; onClose: () => void }> = ({ isOpen, member, onClose }) => {
  
  // Bloquer le scroll et gérer la touche Echap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Reconstruction de l'image mémorisée
  const avatarUrl = useMemo(() => {
    if (!member?.imageUrl) return `https://ui-avatars.com/api/?name=${member?.firstName}&background=FF4B4B&color=fff`;
    if (member.imageUrl.startsWith('http')) return member.imageUrl;
    return `https://lh3.googleusercontent.com/d/$$${member.imageUrl}`;
  }, [member?.imageUrl, member?.firstName]);

  if (!isOpen || !member) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className={`w-full max-w-2xl ${THEME.card} bg-white dark:bg-brand-bg overflow-hidden animate-in zoom-in duration-300 shadow-2xl`}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur la carte
      >
        
        {/* Header Coloré */}
        <div className="relative h-20 bg-brand-primary border-b-4 border-brand-primary-dark">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-xl text-white transition-all active:scale-90"
            title="Fermer"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="px-10 pb-8">
          {/* Avatar flottant */}
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-28 h-28 rounded-3xl border-4 border-white bg-white border-b-8 border-b-brand-border-dark overflow-hidden shadow-lg">
              <img 
                src={avatarUrl} 
                className="w-full h-full object-cover"
                alt="member avatar"
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.firstName}&background=FF4B4B&color=fff` }}
              />
            </div>
            <span className={`px-4 py-2 rounded-xl text-[10px] ${THEME.font.black} bg-brand-primary/10 text-brand-primary border-2 border-brand-primary border-b-4 uppercase`}>
              {member.status || "MEMBRE ACTIF"}
            </span>
          </div>

          <h2 className={`text-2xl ${THEME.font.black} text-brand-text mb-1 tracking-tight`}>
            {member.firstName} {member.lastName}
          </h2>
          <p className={`text-brand-primary ${THEME.font.black} text-[10px] flex items-center gap-2 mb-6 uppercase tracking-widest`}>
            <AiOutlineIdcard size={16}/> ID MATRICULE : {member.id}
          </p>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t-2 border-brand-border">
            <InfoItem icon={<AiOutlinePhone />} label="Téléphone" value={member.phoneNumber} />
            <InfoItem icon={<AiOutlineEnvironment />} label="Quartier / District" value={member.district?.name} />
            <InfoItem icon={<AiOutlineTeam />} label="Genre" value={member.gender} />
            <InfoItem icon={<AiOutlineCalendar />} label="Date de Naissance" value={member.birthDate} />
            <InfoItem icon={<AiOutlineTeam />} label="Tribu" value={member.tribute?.name} />
            <InfoItem icon={<AiOutlineIdcard />} label="État des Cotisations" value={member.cotisationStatus} />
          </div>
        </div>

        <div className="bg-brand-bg px-10 py-6 flex justify-end border-t-2 border-brand-border gap-4">
            <button onClick={onClose} className={`${THEME.buttonSecondary} px-8 py-3 rounded-2xl text-[11px]`}>
                Retour
            </button>
            <button onClick={onClose} className={`${THEME.buttonPrimary} px-10 py-3 rounded-2xl text-[11px]`}>
                Modifier le profil
            </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

// Composant Interne InfoItem
const InfoItem = memo(({ icon, label, value }: { icon: any, label: string, value: any }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 flex items-center justify-center bg-brand-bg border-2 border-brand-border border-b-4 border-b-brand-border-dark text-brand-primary rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="overflow-hidden">
      <p className={`text-[9px] ${THEME.font.black} text-brand-muted leading-none mb-1 uppercase tracking-tighter`}>{label}</p>
      <p className={`text-brand-text font-bold text-sm truncate`}>{value || 'Non renseigné'}</p>
    </div>
  </div>
));

export default memo(Popup);