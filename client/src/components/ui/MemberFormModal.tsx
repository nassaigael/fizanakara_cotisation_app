import React, { memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  AiOutlineClose, AiOutlineSave, AiOutlineUser, AiOutlineMail, 
  AiOutlinePhone, AiOutlineCamera, AiOutlineEnvironment, 
  AiOutlineTeam, AiOutlineCalendar 
} from 'react-icons/ai';
import { THEME } from '../../styles/theme';
import Input from './Input';
import Button from './Button';
import { useMemberForm } from '../../hooks/useMemberForm';
import type { Member } from '../../utils/types/types';

// Lien vers le dépôt de ton ami (centralisé)
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ton-ami/son-repo/main/";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
  onSuccess: () => void;
}

/**
 * MemberFormModal - Formulaire de création/édition de membre.
 * Gère la validation et la prévisualisation dynamique des images GitHub.
 */
const MemberFormModal: React.FC<Props> = ({ isOpen, onClose, memberToEdit, onSuccess }) => {
  const { formData, handleChange, handleSubmit, loading } = useMemberForm(
    () => { onSuccess(); onClose(); }, 
    memberToEdit
  );

  // Calcul mémorisé de l'aperçu pour éviter les calculs de string à chaque frappe
  const previewUrl = useMemo(() => {
    if (!formData.imageUrl) return null;
    return formData.imageUrl.startsWith('http') 
        ? formData.imageUrl 
        : `${GITHUB_RAW_BASE}${formData.imageUrl}`;
  }, [formData.imageUrl]);

  if (!isOpen) return null;

  const selectStyle = `w-full p-4 bg-brand-bg border-2 border-brand-border border-t-brand-border-dark rounded-2xl font-bold text-brand-text outline-none focus:border-brand-primary focus:border-t-brand-primary-dark transition-all appearance-none cursor-pointer text-sm`;

  const modalContent = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white ${THEME.card} w-full max-w-3xl max-h-[95vh] overflow-y-auto p-8 relative shadow-2xl animate-in zoom-in-95 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Bouton de fermeture discret */}
        <button onClick={onClose} className="absolute top-6 right-6 text-brand-muted hover:text-brand-primary transition-colors p-2 hover:bg-brand-bg rounded-xl">
          <AiOutlineClose size={24} />
        </button>

        {/* Header avec badge visuel */}
        <div className="flex items-center gap-5 mb-10">
          <div className="p-4 bg-brand-primary/10 text-brand-primary rounded-2xl border-2 border-b-4 border-brand-primary shrink-0">
            <AiOutlineUser size={30} />
          </div>
          <div>
            <h2 className={`text-2xl ${THEME.font.black} text-brand-text uppercase leading-none`}>
              {memberToEdit ? 'Modifier le Profil' : 'Nouveau Membre'}
            </h2>
            <p className="text-brand-muted text-[10px] font-black uppercase mt-2 tracking-widest opacity-60">
              Système d'enregistrement sécurisé
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* IDENTITÉ */}
          <div className="space-y-4">
            <h3 className={`text-[11px] ${THEME.font.black} text-brand-primary uppercase tracking-widest border-b-2 border-brand-bg pb-2`}>
                Identité Civile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="ex: Jean" />
                <Input label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="ex: Dupont" />
            </div>
          </div>

          {/* CONTACTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Email professionnel" name="email" type="email" icon={<AiOutlineMail/>} value={formData.email} onChange={handleChange} placeholder="exemple@mail.com" />
            <Input label="Téléphone" name="phoneNumber" icon={<AiOutlinePhone/>} value={formData.phoneNumber} onChange={handleChange} placeholder="034 00 000 00" />
          </div>

          {/* LOCALISATION (Saisie stylisée) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-brand-bg rounded-3xl border-2 border-brand-border">
            <Input label="Quartier / District" name="districtName" icon={<AiOutlineEnvironment/>} value={formData.districtName} onChange={handleChange} placeholder="Localisation..." />
            <Input label="Tribu / Origine" name="tributeName" icon={<AiOutlineTeam/>} value={formData.tributeName} onChange={handleChange} placeholder="Appartenance..." />
          </div>

          {/* DÉTAILS TECHNIQUES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <Input label="Date de naissance" name="birthDate" type="date" icon={<AiOutlineCalendar/>} value={formData.birthDate} onChange={handleChange} />
            
            <div className="space-y-2">
              <label className="block font-black text-brand-muted text-[11px] uppercase ml-1 tracking-widest">Genre</label>
              <div className="relative group">
                <select name="gender" value={formData.gender} onChange={handleChange} className={selectStyle}>
                  <option value="MALE">♂ Masculin</option>
                  <option value="FEMALE">♀ Féminin</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-muted group-focus-within:text-brand-primary">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-black text-brand-muted text-[11px] uppercase ml-1 tracking-widest">Situation</label>
              <div className="relative group">
                <select name="status" value={formData.status} onChange={handleChange} className={selectStyle}>
                  <option value="Etudiant">🎓 Étudiant</option>
                  <option value="Travailleur">💼 Travailleur</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-muted group-focus-within:text-brand-primary">▼</div>
              </div>
            </div>
          </div>

          {/* PHOTO GITHUB */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center bg-brand-primary/5 p-6 rounded-3xl border-2 border-brand-primary/10 border-dashed">
            <div className="md:col-span-3">
              <Input 
                label="Fichier Photo GitHub" 
                name="imageUrl" 
                icon={<AiOutlineCamera/>} 
                value={formData.imageUrl} 
                onChange={handleChange} 
                placeholder="nom-image.png" 
              />
              <p className="text-[9px] text-brand-muted mt-3 font-bold uppercase tracking-tight">
                ⚠️ L'image doit être hébergée sur le dépôt GitHub principal
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
               <div className="h-24 w-24 bg-white rounded-3xl border-2 border-brand-border border-b-4 border-b-brand-border-dark flex items-center justify-center overflow-hidden shadow-sm">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Aperçu" 
                    className="w-full h-full object-cover" 
                    onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=?&background=eee&color=999")}
                  />
                ) : (
                  <AiOutlineCamera className="text-brand-border" size={30} />
                )}
              </div>
              <span className="text-[9px] font-black text-brand-primary uppercase">Photo</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-6 flex gap-4">
            <Button 
                type="button" 
                onClick={onClose} 
                variant="secondary"
                className="flex-1"
            >
              Annuler
            </Button>
            <Button 
                type="submit" 
                disabled={loading} 
                className="flex-[2] py-4"
            >
              <AiOutlineSave className="mr-2" size={20} />
              {loading ? 'Synchronisation...' : memberToEdit ? 'Mettre à jour' : 'Inscrire le membre'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default memo(MemberFormModal);