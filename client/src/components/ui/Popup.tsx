import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { AiOutlinePhone, AiOutlineEnvironment, AiOutlineClose } from "react-icons/ai";
import { getImageUrl } from '../../utils/constants/constants';
import Button from './Button';
const Popup: React.FC<any> = ({ isOpen, member, onClose, onEdit }) => {
  if (!isOpen || !member) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[40px] sm:rounded-[40px] w-full max-w-lg overflow-hidden border-x-4 border-t-4 sm:border-4 border-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300">
        
        <div className="relative h-28 lg:h-32 bg-brand-primary/10 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full sm:hidden">
                <AiOutlineClose size={20} />
            </button>
            <img 
              src={getImageUrl(member.imageUrl, member.firstName)} 
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl border-4 border-white shadow-xl translate-y-8 object-cover"
              alt={member.firstName}
            />
        </div>
        
        <div className="pt-10 pb-6 lg:pb-8 px-6 lg:px-10 text-center">
          <h2 className="text-xl lg:text-2xl font-black text-brand-text uppercase leading-tight">
            {member.firstName} <br className="sm:hidden" /> {member.lastName}
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-4 py-1 rounded-full bg-brand-bg text-[10px] font-black text-brand-primary border border-brand-border uppercase">
                {member.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left">
            <InfoItem icon={<AiOutlinePhone />} label="Téléphone" value={member.phoneNumber} />
            <InfoItem icon={<AiOutlineEnvironment />} label="Quartier" value={member.districtName || 'N/A'} />
          </div>
        </div>

        <div className="p-6 bg-brand-bg flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 order-2 sm:order-1">Fermer</Button>
          <Button variant="primary" onClick={() => onEdit?.(member.id)} className="flex-1 order-1 sm:order-2">Modifier</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoItem = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-brand-border border-b-4">
        <div className="text-brand-primary shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-[9px] font-black text-brand-muted uppercase truncate">{label}</p>
            <p className={`text-xs font-bold text-brand-text truncate`}>{value}</p>
        </div>
    </div>
);

export default memo(Popup);