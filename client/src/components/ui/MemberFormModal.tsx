import React from 'react';
import { AiOutlineClose, AiOutlineSave, AiOutlineUser } from 'react-icons/ai';
import { useMemberForm } from '../../hooks/useMemberForm';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Member } from '../../utils/types/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit: Member | null;
}

const MemberFormModal: React.FC<Props> = ({ isOpen, onClose, memberToEdit }) => {
  const { formData, handleChange, handleSubmit, loading } = useMemberForm(onClose, memberToEdit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="h-full w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
        
        {/* Header du Modal */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AiOutlineUser size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {memberToEdit ? "Modifier le membre" : "Ajouter un membre"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <AiOutlineClose size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" name="first_name" value={formData.first_name} onChange={handleChange} required />
            <Input label="Nom" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>

          <Input label="Téléphone" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Sexe</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700">
                <option value="MALE">Masculin</option>
                <option value="FEMALE">Féminin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date de naissance</label>
              <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Situation Sociale</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700">
              <option value="ETUDIANT">Etudiant</option>
              <option value="TRAVAILLEUR">Travailleur</option>
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="pt-8 flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1 justify-center">Annuler</Button>
            <Button type="submit" disabled={loading} className="flex-1 justify-center">
              <AiOutlineSave size={20} /> {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;