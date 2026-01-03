import React, { useState } from 'react';
import { Admin } from '../hooks/Admin.hooks';
import { getImageUrl } from '../utils/constants/constants';
import { Shield, Trash2, Edit2, Save, X, Globe } from 'lucide-react';
import {Alert} from '../components';

const AdminProfile: React.FC = () => {
    const { 
        admin, formData, isEditing, loading, 
        setIsEditing, handleInputChange, onSave, handleDelete 
    } = Admin();

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    if (loading) return <div className="p-20 text-center font-black text-[#58cc02] animate-pulse uppercase">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-[0_4px_0_0_#e5e5e5] border-2 border-[#e5e5e5] overflow-hidden">
                    <div className="p-8 border-b-2 border-[#f1f1f1] flex flex-col md:flex-row items-center gap-8 bg-linear-to-b from-white to-[#fafafa]">
                        <div className="relative">
                            <img 
                                src={getImageUrl(admin?.imageUrl, admin?.firstName)} 
                                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-[#58cc02] shadow-[0_6px_0_0_#46a302] object-cover bg-white"
                                alt="Profile"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-[#58cc02] text-white p-2 rounded-xl shadow-lg">
                                <Shield size={20} />
                            </div>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-black text-[#4b4b4b] tracking-tight">
                                {admin?.firstName} {admin?.lastName}
                            </h1>
                            <p className="text-[#afafaf] font-bold uppercase tracking-widest text-sm mt-1">Administrateur Principal</p>
                            <div className="mt-6">
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${isEditing ? 'bg-[#afafaf] border-[#8a8a8a] text-white' : 'bg-[#1cb0f6] border-[#1899d6] text-white'}`}
                                >
                                    {isEditing ? <><X size={18}/> ANNULER</> : <><Edit2 size={18}/> MODIFIER LE PROFIL</>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- FORM SECTION --- */}
                    <form onSubmit={onSave} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileInput label="Image du profil (GitHub)" name="imageUrl" value={formData.imageUrl} icon={<Globe size={16}/>} onChange={handleInputChange} disabled={!isEditing} fullWidth />
                            <ProfileInput label="Prénom" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                            <ProfileInput label="Nom" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                            <ProfileInput label="Email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
                            <ProfileInput label="Téléphone" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                        
                        {isEditing && (
                            <button type="submit" className="w-full py-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xl rounded-2xl shadow-[0_4px_0_0_#3d8a02] active:shadow-none active:translate-y-1 transition-all uppercase">
                                <Save className="inline-block mr-2" size={24}/> Sauvegarder
                            </button>
                        )}
                    </form>
                </div>

                {/* --- DELETE SECTION --- */}
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => setIsAlertOpen(true)} // On ouvre l'alerte au lieu du window.confirm
                        className="flex items-center gap-2 text-[#ff4b4b] font-black hover:bg-red-50 px-6 py-3 rounded-2xl transition-colors uppercase text-xs"
                    >
                        <Trash2 size={16} /> Supprimer le compte
                    </button>
                </div>
            </div>

            {/* --- COMPOSANT ALERTE --- */}
            <Alert 
                isOpen={isAlertOpen}
                title="Suppression de compte"
                message="Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible mais les membres créés seront conservés."
                confirmText="Oui, Supprimer"
                variant="danger"
                onClose={() => setIsAlertOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};
const ProfileInput = ({ label, name, value, onChange, disabled, icon, fullWidth }: any) => (
    <div className={`${fullWidth ? 'md:col-span-2' : ''} space-y-2`}>
        <label className="flex items-center gap-2 text-sm font-black text-[#afafaf] uppercase tracking-wider ml-1">
            {icon} {label}
        </label>
        <input 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            disabled={disabled} 
            className={`duo-input ${!disabled ? 'active' : ''}`} 
        />
        <style>{`
            .duo-input { width: 100%; padding: 12px 16px; border-radius: 16px; border: 2px solid #e5e5e5; background-color: #f7f7f7; font-weight: 800; color: #4b4b4b; transition: all 0.2s; outline: none; }
            .duo-input.active { background-color: white; border-color: #1cb0f6; box-shadow: 0 4px 0 0 #1899d6; }
            .duo-input:focus { border-color: #1cb0f6; }
            .duo-input:disabled { cursor: not-allowed; opacity: 0.7; }
        `}</style>
    </div>
);

export default AdminProfile;