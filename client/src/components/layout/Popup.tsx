import React from 'react';
import { 
  AiOutlineClose, AiOutlinePhone, AiOutlineEnvironment, 
  AiOutlineCalendar, AiOutlineTeam, AiOutlineIdcard 
} from "react-icons/ai";
import type { Member } from "../../utils/types/memberType";

interface Props {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
}

const Popup: React.FC<Props> = ({ isOpen, member, onClose }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="relative h-32 bg-linear-to-r from-red-600 to-red-400">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <img 
              src={member.imageUrl || 'https://via.placeholder.com/150'} 
              alt={member.firstName}
              className="w-32 h-32 rounded-3xl border-4 border-white object-cover shadow-lg bg-gray-200"
            />
            <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
              member.cotisationStatus === 'Payé' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {member.cotisationStatus || "Statut Inconnu"}
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-800 mb-1">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-red-500 font-semibold mb-6 flex items-center gap-2">
            <AiOutlineIdcard /> N° Séquence : {member.sequenceNumber}
          </p>

          <hr className="border-gray-100 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<AiOutlinePhone />} label="Téléphone" value={member.phoneNumber} />
            <InfoItem icon={<AiOutlineEnvironment />} label="Quartier" value={member.quartier} />
            <InfoItem icon={<AiOutlineTeam />} label="Tribu" value={member.tribe} />
            <InfoItem icon={<AiOutlineCalendar />} label="Date de naissance" value={member.birthDate} />
            <InfoItem icon={<AiOutlineTeam />} label="Sexe" value={member.gender} />
            <InfoItem icon={<AiOutlineIdcard />} label="Situation Sociale" value={member.statusSocial} />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-red-50 text-red-500 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{label}</p>
      <p className="text-gray-700 font-medium">{value || 'Non renseigné'}</p>
    </div>
  </div>
);

export default Popup;