import React from 'react';
import { 
  AiOutlineClose, AiOutlinePhone, AiOutlineEnvironment, 
  AiOutlineCalendar, AiOutlineTeam, AiOutlineIdcard 
} from "react-icons/ai";
import type { Member } from "../../utils/types/types";

interface Props {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
}

const Popup: React.FC<Props> = ({ isOpen, member, onClose }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="relative h-32 bg-linear-to-r from-red-600 to-red-400">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="px-10 pb-10">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <img 
              src={member.image_url || `https://ui-avatars.com/api/?name=${member.first_name}`} 
              className="w-32 h-32 rounded-3xl border-8 border-white object-cover shadow-xl bg-gray-200"
              alt="avatar"
            />
            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
              member.cotisationStatus === 'Payé' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {member.cotisationStatus || "Statut Inconnu"}
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-1 leading-tight">
            {member.first_name} {member.last_name}
          </h2>
          <p className="text-red-500 font-bold text-sm flex items-center gap-2 mb-8">
            <AiOutlineIdcard /> MATRICULE : {member.sequence_number || 'N/A'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-gray-50">
            <InfoItem icon={<AiOutlinePhone />} label="Téléphone" value={member.phone_number} />
            <InfoItem icon={<AiOutlineEnvironment />} label="Localisation" value={`District ID: ${member.district_id}`} />
            <InfoItem icon={<AiOutlineTeam />} label="Genre" value={member.gender === 'MALE' ? 'Masculin' : 'Féminin'} />
            <InfoItem icon={<AiOutlineCalendar />} label="Date de naissance" value={member.birth_date} />
            <InfoItem icon={<AiOutlineIdcard />} label="Statut" value={member.status} />
            <InfoItem icon={<AiOutlineTeam />} label="Tribu" value={`Tribe ID: ${member.tribute_id}`} />
          </div>
        </div>

        <div className="bg-gray-50 px-10 py-6 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 text-sm">
            Fermer le profil
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 text-red-500 rounded-xl border border-gray-100 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{label}</p>
      <p className="text-gray-800 font-bold">{value || 'Non renseigné'}</p>
    </div>
  </div>
);

export default Popup;