import React, { memo, useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AiOutlineSave, AiOutlineCamera, AiOutlineClose, AiOutlineGlobal, AiOutlineTeam, AiOutlineUser } from 'react-icons/ai';
import { THEME } from '../../styles/theme';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';
import { getImageUrl } from '../../lib/constant/constant';
import { useMemberForm } from '../../hooks/useMemberForm';
import { DistrictService } from '../../services/district.service';
import { TributeService } from '../../services/tribute.service';
import { DistrictDto, TributeDto } from '../../lib/types/models/common.type';

const MemberForm: React.FC<any> = ({ isOpen, onClose, memberToEdit, onSuccess }) => {
  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [tributes, setTributes] = useState<TributeDto[]>([]);

  const { formData, handleChange, handleSubmit, loading, errors } = useMemberForm(
    () => { onSuccess?.(); onClose(); }, 
    memberToEdit
  );

  useEffect(() => {
    if (isOpen) {
        DistrictService.getAll().then(setDistricts);
        TributeService.getAll().then(setTributes);
    }
  }, [isOpen]);

  // Utilise la logique centralisée dans constant.ts pour générer l'URL GitHub
  const previewUrl = useMemo(() => 
    getImageUrl(formData.imageUrl, formData.firstName, 'member'), 
    [formData.imageUrl, formData.firstName]
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-150 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-[40px] flex flex-col border-4 border-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b-2 border-brand-border flex justify-between items-center bg-white">
          <h2 className={`text-xl ${THEME.font.black} text-brand-text uppercase italic`}>
            {memberToEdit ? 'Modifier la fiche' : 'Nouveau Membre'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors border-2 border-transparent hover:border-brand-border">
            <AiOutlineClose size={24} className="text-brand-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* SECTION APERÇU PROFIL (Nouveau) */}
          <div className="relative mb-8 p-6 bg-linear-to-br from-brand-bg to-white rounded-4xl border-2 border-brand-border overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar avec cercle de statut */}
              <div className="relative">
                <div className="h-28 w-28 bg-white rounded-3xl border-4 border-white shadow-xl overflow-hidden ring-2 ring-brand-border">
                  <img 
                    src={previewUrl} 
                    alt="Aperçu" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback si l'image GitHub n'existe pas encore
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${formData.firstName || 'User'}&background=random`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-xl shadow-lg">
                  <AiOutlineCamera size={18} />
                </div>
              </div>

              {/* Infos en direct */}
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-2xl font-black text-brand-text uppercase leading-none mb-1">
                  {formData.firstName || 'Prénom'} {formData.lastName || 'Nom'}
                </h3>
                <p className="text-sm font-bold text-brand-muted flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2 py-0.5 bg-brand-border rounded-lg text-[10px]">
                    {formData.status === 'STUDENT' ? 'ÉTUDIANT' : 'TRAVAILLEUR'}
                  </span>
                  • {formData.phoneNumber || '03X XX XXX XX'}
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire classique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Ex: Jean" />
            <Input label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Ex: DUPONT" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Date de naissance" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />
            <Input label="Téléphone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} placeholder="034 XX XXX XX" />
          </div>

          <div className="p-4 bg-brand-bg/50 rounded-2xl border-2 border-brand-border">
            <Input 
                label="Nom du fichier image (sur GitHub)" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                error={errors.imageUrl} 
                icon={<AiOutlineCamera />} 
                placeholder="Ex: jean_photo (sans .jpg)" 
            />
            <p className="text-[10px] text-brand-muted mt-2 ml-1 font-medium">
              L'URL finale sera : {previewUrl}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Select label="Genre" name="gender" value={formData.gender} onChange={handleChange} options={[{ value: 'MALE', label: 'Homme' }, { value: 'FEMALE', label: 'Femme' }]} placeholder={''} />
             <Select label="Statut" name="status" value={formData.status} onChange={handleChange} options={[{ value: 'STUDENT', label: 'Étudiant' }, { value: 'WORKER', label: 'Travailleur' }]} placeholder={''} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
                label="District" 
                name="districtId" 
                value={formData.districtId} 
                onChange={handleChange} 
                error={errors.districtId}
                options={districts.map(d => ({ value: d.id ?? 0, label: d.name }))}
                icon={<AiOutlineGlobal size={20} />}
            />
             <Select 
                label="Tribu" 
                name="tributeId" 
                value={formData.tributeId} 
                onChange={handleChange} 
                error={errors.tributeId}
                options={tributes.map(t => ({ value: t.id ?? 0, label: t.name }))}
                icon={<AiOutlineTeam size={20} />}
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t-2 border-brand-border flex gap-4">
          <Button variant="secondary" onClick={onClose} className="flex-1 hidden sm:flex">Annuler</Button>
          <Button type="submit" onClick={handleSubmit} isLoading={loading} className="flex-2 py-4 h-14">
            <AiOutlineSave size={20} className="mr-2" />
            {memberToEdit ? 'Mettre à jour' : 'Enregistrer le membre'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default memo(MemberForm);