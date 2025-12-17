import React, { useState } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineEdit, AiOutlineDelete,
  AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle,
  AiOutlineUnorderedList, AiOutlinePlus,
  AiOutlineFilter,
  AiOutlineSafetyCertificate
} from "react-icons/ai";

import { useMemberLogic } from "../hooks/useMemberLogic";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Popup from "../components/layout/Popup";
import { TRIBES, COTISATION_STATUSES} from "../utils/constants/constants";
import type { CotisationStatus, Member } from "../utils/types/types";

// Composant Interne pour les icônes de statut
const CotisationIcon = ({ status }: { status?: CotisationStatus }) => {
    switch (status) {
        case "Payé": return <AiOutlineCheckCircle size={20} className="text-green-500" />;
        case "En cours": return <AiOutlineClockCircle size={20} className="text-yellow-500" />;
        case "En attente": return <AiOutlineClockCircle size={20} className="text-blue-500" />;
        case "Impayé": return <AiOutlineCloseCircle size={20} className="text-red-500" />;
        default: return <AiOutlineClockCircle size={20} className="text-gray-300" />;
    }
};

const MemberPage: React.FC = () => {
    const { 
        members, loading, search, setSearch,
        filterSex, setFilterSex,
        filterTribe, setFilterTribe,
        filterCotisation, setFilterCotisation,
        selectedMembers, handleSelect, handleSelectAll, deleteAction
    } = useMemberLogic();

    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [memberToView, setMemberToView] = useState<Member | null>(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center font-black text-red-500 animate-pulse text-xl uppercase tracking-widest">
                Chargement de la base de données...
            </div>
        </div>
    );

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-red-100 gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                    <AiOutlineUnorderedList className="text-red-500" /> Annuaire Mixte
                </h1>
                <Button to="/admin/member/add" variant="primary">
                    <AiOutlinePlus size={20} /> Nouveau Membre
                </Button>
            </div>

            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-100">
                <div className="relative grow min-w-[250px]">
                    <AiOutlineSearch className="absolute left-3 top-3.5 text-gray-400" size={20}/>
                    <input
                        type="text"
                        placeholder="Nom, matricule, téléphone..."
                        value={search}
                        className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-gray-50/50 transition"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className={`flex items-center gap-2 py-3 px-6 rounded-xl font-bold border transition-all ${
                        isFilterPanelOpen ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <AiOutlineFilter size={20} /> Filtres
                </button>
            </div>

            {/* Filters Panel */}
            <div className={`bg-white rounded-2xl shadow-inner transition-all duration-300 overflow-hidden ${isFilterPanelOpen ? "max-h-[500px] p-6 border mb-8" : "max-h-0 p-0"}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Genre</label>
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            {["", "MALE", "FEMELLE"].map((g) => (
                                <button 
                                    key={g}
                                    onClick={() => setFilterSex(g as any)} 
                                    className={`flex-1 py-2 rounded-md text-xs font-bold transition ${filterSex === g ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {g === "" ? "Tous" : g === "MALE" ? "Hommes" : "Femmes"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Tribu</label>
                        <select value={filterTribe} onChange={(e) => setFilterTribe(e.target.value)} className="w-full border-gray-200 border p-2.5 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-red-500">
                            <option value="">Toutes les origines</option>
                            {TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Cotisation</label>
                        <select value={filterCotisation} onChange={(e) => setFilterCotisation(e.target.value)} className="w-full border-gray-200 border p-2.5 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-red-500">
                            <option value="">Tous les statuts</option>
                            {COTISATION_STATUSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="p-5 w-12 text-center">
                                <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} className="accent-red-500 w-4 h-4" />
                            </th>
                            <th className="p-5">Membre</th>
                            <th className="p-5">Coordonnées</th>
                            <th className="p-5">Catégorie</th>
                            <th className="p-5 text-center">Cotisation</th>
                            <th className="p-5 text-right">Options</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {members.map(member => (
                            <tr key={member.id} className={`group transition-colors hover:bg-red-50/20 ${selectedMembers.includes(member.id) ? "bg-red-50/50" : ""}`}>
                                <td className="p-5 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedMembers.includes(member.id)} 
                                        onChange={() => handleSelect(member.id)} 
                                        className="accent-red-500 w-4 h-4" 
                                    />
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative shrink-0">
                                            <img 
                                                src={member.image_url || 'https://ui-avatars.com/api/?name=' + member.first_name} 
                                                className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover" 
                                                alt="avatar" 
                                            />
                                            {member.email && <AiOutlineSafetyCertificate className="absolute -top-1 -right-1 text-blue-500 bg-white rounded-full p-0.5 shadow-sm" size={18}/>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 leading-tight">{member.first_name} {member.last_name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                                                {member.email || `REF: ${member.sequence_number}`}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <p className="text-sm font-bold text-gray-700">{member.phone_number || "Non renseigné"}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Né(e) le {member.birth_date}</p>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 text-[9px] font-black rounded-full border shadow-sm ${
                                        member.email 
                                        ? "bg-blue-50 text-blue-600 border-blue-100" 
                                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    }`}>
                                        {member.email ? "ADMINISTRATEUR" : (member.status || "MEMBRE")}
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <div className="flex justify-center">
                                        <CotisationIcon status={member.cotisationStatus} />
                                    </div>
                                </td>
                                <td className="p-5 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setMemberToView(member)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition"><AiOutlineEye size={18}/></button>
                                    <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition"><AiOutlineEdit size={18}/></button>
                                    <button onClick={() => setIsDeletePopupOpen(true)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"><AiOutlineDelete size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {memberToView && <Popup isOpen={true} member={memberToView} onClose={() => setMemberToView(null)} />}
            
            <Alert 
                isOpen={isDeletePopupOpen} 
                variant="danger" 
                title="Confirmation" 
                message={`Êtes-vous sûr de vouloir supprimer ${selectedMembers.length} membre(s) sélectionné(s) ? Cette action est irréversible.`} 
                onConfirm={() => { deleteAction(selectedMembers); setIsDeletePopupOpen(false); }} 
                onClose={() => setIsDeletePopupOpen(false)} 
            />
        </div>
    );
};

export default MemberPage;