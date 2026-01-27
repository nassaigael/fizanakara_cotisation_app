import React, { useState } from 'react';
import { AiOutlineUserAdd, AiOutlineGlobal, AiOutlineArrowLeft } from 'react-icons/ai';
import AdminRegisterForm from '../components/management/AdminRegisterForm';
import ManageOrganization from '../components/management/ManageOrganization';

const AdminManagement: React.FC = () => {
    const [view, setView] = useState<'menu' | 'admins' | 'org'>('menu');

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-brand-text uppercase tracking-tighter">Console Maître</h1>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.3em] mt-1">Configuration Système Fizanakara</p>
                </div>
                
                {view !== 'menu' && (
                    <button 
                        onClick={() => setView('menu')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-brand-border rounded-xl font-black text-[10px] uppercase hover:bg-brand-bg transition-all"
                    >
                        <AiOutlineArrowLeft /> Retour au menu
                    </button>
                )}
            </div>

            {view === 'menu' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                    <button 
                        onClick={() => setView('admins')}
                        className="group bg-white border-2 border-brand-border border-b-8 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 hover:translate-y-1 hover:border-b-4 transition-all"
                    >
                        <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                            <AiOutlineUserAdd size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-brand-text uppercase">Gestion des Admins</h3>
                            <p className="text-[10px] font-bold text-brand-muted uppercase mt-2">Créer et gérer les accès sécurisés</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => setView('org')}
                        className="group bg-white border-2 border-brand-border border-b-8 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 hover:translate-y-1 hover:border-b-4 transition-all"
                    >
                        <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <AiOutlineGlobal size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-brand-text uppercase">Gestion des Lieux</h3>
                            <p className="text-[10px] font-bold text-brand-muted uppercase mt-2">Districts et Tribus (Tributes)</p>
                        </div>
                    </button>
                </div>
            ) : view === 'admins' ? (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <AdminRegisterForm />
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <ManageOrganization />
                </div>
            )}

            <div className="text-center pt-10">
                <span className="px-4 py-2 bg-brand-bg border-2 border-brand-border rounded-full text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">
                    Seul le compte SuperAdmin peut modifier ces paramètres
                </span>
            </div>
        </div>
    );
};

export default AdminManagement;