import React, { memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AiOutlineSave, AiOutlineCamera, AiOutlineClose } from 'react-icons/ai';
import { THEME } from '../../styles/theme';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { getImageUrl } from '../../utils/constants/constants';
import { useMemberForm } from '../../hooks/useMemberForm';

const MemberFormModal: React.FC<any> = ({ isOpen, onClose, memberToEdit, onSuccess }) => {
  const { formData, handleChange, handleSubmit, loading, errors } = useMemberForm(
    () => { onSuccess?.(); onClose(); }, 
    memberToEdit
  );

  const previewUrl = useMemo(() => getImageUrl(formData.imageUrl, formData.firstName), [formData.imageUrl, formData.firstName]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-150 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-[40px] flex flex-col border-4 border-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300">
        <div className="p-6 border-b-2 border-brand-border flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className={`text-xl ${THEME.font.black} text-brand-text uppercase`}>
            {memberToEdit ? 'Modifier Membre' : 'Nouveau Membre'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors">
            <AiOutlineClose size={24} className="text-brand-muted" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Input label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
            <Input label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 p-6 bg-brand-bg/50 rounded-3xl border-2 border-dashed border-brand-border items-center">
            <div className="flex-1 w-full">
              <Input label="Nom du fichier image" name="imageUrl" value={formData.imageUrl} onChange={handleChange} icon={<AiOutlineCamera />} />
            </div>
            <div className="h-24 w-24 bg-white rounded-2xl border-2 border-brand-border border-b-4 overflow-hidden shadow-lg shrink-0">
              <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Select label="Genre" name="gender" value={formData.gender} onChange={handleChange} options={[{value:'MALE', label:'Homme'}, {value:'FEMALE', label:'Femme'}]} />
             <Input label="Téléphone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t-2 border-brand-border flex gap-4 sticky bottom-0">
          <Button variant="secondary" onClick={onClose} className="flex-1 hidden sm:flex">Annuler</Button>
          <Button type="submit" onClick={handleSubmit} isLoading={loading} className="flex-2 py-4">
            <AiOutlineSave size={20} />
            {memberToEdit ? 'Mettre à jour' : 'Enregistrer le membre'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default memo(MemberFormModal);