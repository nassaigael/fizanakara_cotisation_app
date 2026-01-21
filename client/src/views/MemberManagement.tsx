import React, { useState, useMemo } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineDelete, 
  AiOutlinePlus, AiOutlineFilter, AiOutlineEdit 
} from "react-icons/ai";
import { useMemberLogic } from "../hooks/useMembers";
import { MemberHelper } from "../lib/helper/member.helper";
import { getFinancials } from "../lib/helper/finance.helper";
import Button from "../components/shared/Button";
import { PersonResponseDto } from "../lib/types/models/person.type";

import MemberForm from "../components/modals/MemberForm";

const MemberManagement: React.FC = () => {
    const { 
        members, allMembers, loading, search, setSearch, 
        filterSex, setFilterSex, 
        filterDistrict, setFilterDistrict, 
        filterTribe, setFilterTribe, 
        selectedMembers, handleSelect, handleSelectAll, 
        deleteAction, refreshMembers 
    } = useMemberLogic();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMember, setViewMember] = useState<PersonResponseDto | null>(null);

    /**
     * État pour la gestion du formulaire (Ajout / Édition)
     */
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        memberToEdit: PersonResponseDto | null;
    }>({
        isOpen: false,
        memberToEdit: null
    });

    const districtOptions = useMemo(() => Array.from(new Set(allMembers.map(m => m.districtName))).filter(Boolean), [allMembers]);
    const tributeOptions = useMemo(() => Array.from(new Set(allMembers.map(m => m.tributeName))).filter(Boolean), [allMembers]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-100">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-[10px] uppercase tracking-widest text-brand-muted">Chargement de la base...</p>
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-brand-text uppercase leading-none tracking-tighter">Membres</h1>
                    <p className="text-brand-muted font-bold text-[9px] uppercase mt-1 tracking-widest">Répertoire National Fizanakara</p>
                </div>
                {/* Bouton pour ouvrir le formulaire en mode création */}
                <Button 
                    onClick={() => setFormModal({ isOpen: true, memberToEdit: null })}
                    className="flex items-center gap-2"
                >
                    <AiOutlinePlus size={18}/> NOUVEAU
                </Button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <AiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" size={20}/>
                    <input 
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="NOM, MATRICULE OU TÉLÉPHONE..." 
                        className="w-full pl-14 pr-4 h-14 bg-white border-2 border-brand-border rounded-2xl font-black text-[10px] uppercase outline-none focus:border-brand-primary shadow-sm" 
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className={`flex items-center gap-2 px-8 rounded-2xl font-black text-[10px] border-2 transition-all ${isFilterOpen ? 'bg-brand-text text-white border-brand-text' : 'bg-white text-brand-text border-brand-border'}`}
                >
                    <AiOutlineFilter size={18}/> FILTRES
                </button>
            </div>

            {/* Panel Filtres */}
            {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-brand-bg/50 border-2 border-brand-border rounded-3xl animate-in slide-in-from-top-2">
                    <select value={filterSex} onChange={(e) => setFilterSex(e.target.value)} className="p-3 rounded-xl border-2 border-brand-border font-bold text-[10px] uppercase outline-none focus:border-brand-primary">
                        <option value="">Tous les genres</option>
                        <option value="MALE">Homme</option>
                        <option value="FEMALE">Femme</option>
                    </select>
                    <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="p-3 rounded-xl border-2 border-brand-border font-bold text-[10px] uppercase outline-none focus:border-brand-primary">
                        <option value="">Tous les districts</option>
                        {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={filterTribe} onChange={(e) => setFilterTribe(e.target.value)} className="p-3 rounded-xl border-2 border-brand-border font-bold text-[10px] uppercase outline-none focus:border-brand-primary">
                        <option value="">Toutes les tribus</option>
                        {tributeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            )}

            {/* Actions Groupées */}
            {selectedMembers.length > 0 && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex justify-between items-center animate-in zoom-in-95">
                    <p className="text-[10px] font-black text-red-700 uppercase">{selectedMembers.length} MEMBRES SÉLECTIONNÉS</p>
                    <button onClick={() => deleteAction(selectedMembers)} className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[9px] hover:bg-red-700 transition-colors">SUPPRIMER LA SÉLECTION</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border-2 border-brand-border border-b-8 rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-bg/80 border-b-2 border-brand-border">
                            <tr className="text-[9px] font-black text-brand-muted uppercase tracking-widest">
                                <th className="p-5 w-10"><input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} /></th>
                                <th className="p-5 text-left">Membre</th>
                                <th className="p-5 text-left">Localisation</th>
                                <th className="p-5 text-left">Cotisation</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-bg">
                            {members.map(m => {
                                const { paye, reste } = getFinancials(m);
                                return (
                                    <tr key={m.id} className="hover:bg-brand-bg/30 transition-all group">
                                        <td className="p-5 text-center">
                                            <input type="checkbox" checked={selectedMembers.includes(m.id)} onChange={() => handleSelect(m.id)} />
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <img src={m.imageUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-border" alt="" />
                                                <div>
                                                    <div className="font-black text-xs uppercase text-brand-text">{m.firstName} {m.lastName}</div>
                                                    <div className="text-[9px] font-bold text-brand-muted">{m.phoneNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-black text-[10px] uppercase text-brand-primary">{m.districtName}</div>
                                            <div className="text-[9px] font-bold text-brand-muted uppercase">{m.tributeName}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className={`inline-flex flex-col px-3 py-1 rounded-lg ${reste <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                <span className="text-[10px] font-black">{paye.toLocaleString()} Ar</span>
                                                {reste > 0 && <span className="text-[8px] font-bold opacity-70 italic">Reste: {reste.toLocaleString()}</span>}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Bouton Voir */}
                                                <button onClick={() => setViewMember(m)} className="p-2 bg-brand-bg border-2 border-brand-border rounded-xl hover:text-brand-primary transition-all shadow-sm" title="Détails">
                                                    <AiOutlineEye size={18}/>
                                                </button>
                                                {/* Bouton Éditer */}
                                                <button 
                                                    onClick={() => setFormModal({ isOpen: true, memberToEdit: m })} 
                                                    className="p-2 bg-brand-bg border-2 border-brand-border rounded-xl hover:text-brand-primary transition-all shadow-sm"
                                                    title="Modifier"
                                                >
                                                    <AiOutlineEdit size={18}/>
                                                </button>
                                                {/* Bouton Supprimer */}
                                                <button onClick={() => deleteAction([m.id])} className="p-2 bg-brand-bg border-2 border-brand-border rounded-xl hover:text-red-500 transition-all shadow-sm" title="Supprimer">
                                                    <AiOutlineDelete size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL FORMULAIRE (AJOUT / ÉDITION) --- */}
            <MemberForm 
                isOpen={formModal.isOpen} 
                onClose={() => setFormModal({ isOpen: false, memberToEdit: null })}
                memberToEdit={formModal.memberToEdit}
                onSuccess={() => {
                    refreshMembers(); // Rafraîchit la liste des membres
                    setFormModal({ isOpen: false, memberToEdit: null }); // Ferme le modal
                }}
            />

            {/* Modal de détails (Lecture seule) */}
            {viewMember && (
                <div className="fixed inset-0 bg-brand-text/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white border-2 border-brand-border border-b-8 rounded-[3rem] w-full max-w-md p-8 animate-in zoom-in-95 duration-300 relative">
                        <button 
                            onClick={() => setViewMember(null)}
                            className="absolute top-6 right-6 p-2 bg-brand-bg rounded-full border-2 border-brand-border hover:text-brand-primary transition-colors"
                        >
                            <AiOutlinePlus className="rotate-45" size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <img src={viewMember.imageUrl} className="w-28 h-28 rounded-3xl border-4 border-white shadow-2xl -mt-20 object-cover" alt="Profile" />
                            <h2 className="mt-4 text-2xl font-black uppercase italic leading-none">{viewMember.lastName}</h2>
                            <p className="text-brand-primary font-black uppercase text-xs mb-6">{viewMember.firstName}</p>
                            
                            <div className="grid grid-cols-2 gap-3 w-full text-left">
                                <DetailBox label="Statut" value={viewMember.status} />
                                <DetailBox label="Sexe" value={viewMember.gender === 'MALE' ? 'Homme' : 'Femme'} />
                                <DetailBox label="Naissance" value={MemberHelper.formatDate(viewMember.birthDate)} />
                                <DetailBox label="Parent" value={viewMember.parentName || "Non spécifié"} />
                                <div className="col-span-2">
                                    <DetailBox label="Téléphone" value={viewMember.phoneNumber} />
                                </div>
                            </div>
                            <Button onClick={() => setViewMember(null)} className="mt-8 w-full">FERMER LA FICHE</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailBox = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-brand-bg p-3 rounded-2xl border-2 border-brand-border">
        <p className="text-[7px] font-black text-brand-muted uppercase tracking-widest">{label}</p>
        <p className="font-bold text-[10px] uppercase truncate">{value}</p>
    </div>
);

export default MemberManagement;