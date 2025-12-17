import React, { useState } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineEdit, AiOutlineDelete,
  AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle,
  AiOutlineUnorderedList, AiOutlineDollarCircle, AiOutlinePlus,
  AiOutlineTeam, AiOutlineFilter, AiOutlineMan, AiOutlineWoman 
} from "react-icons/ai";

import { useMemberLogic } from "../hooks/useMemberLogic";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Popup from "../components/layout/Popup";
import { TRIBES, COTISATION_STATUSES, SITUATIONS } from "../utils/constants/constants";
import type { CotisationStatus, Member } from "../utils/types/memberType";

const CotisationIcon = ({ status }: { status?: CotisationStatus }) => {
    switch (status) {
        case "Payé": return <AiOutlineCheckCircle size={20} className="text-green-500" title="Payé" />;
        case "En cours": return <AiOutlineClockCircle size={20} className="text-yellow-500" title="En cours" />;
        case "En attente": return <AiOutlineClockCircle size={20} className="text-blue-500" title="En attente" />;
        case "Impayé": return <AiOutlineCloseCircle size={20} className="text-red-500" title="Impayé" />;
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

    const handleResetFilters = () => {
        setSearch("");
        setFilterSex("");
        setFilterTribe("");
        setFilterCotisation("");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl font-black text-red-500 animate-pulse">
                    CHARGEMENT DES MEMBRES...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-100">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                    <AiOutlineUnorderedList className="text-red-500" /> Liste des Membres
                </h1>
                <Button to="/admin/member/add" variant="primary" className="py-2.5">
                    <AiOutlinePlus size={20} /> Ajouter un Membre
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-red-50/50 mb-8 flex flex-wrap gap-4 items-center">
                <div className="relative grow min-w-[200px] md:min-w-[300px]">
                    <AiOutlineSearch className="absolute left-3 top-3.5 text-red-500" size={20}/>
                    <input
                        type="text"
                        placeholder="Rechercher nom, prénom, quartier..."
                        value={search}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className={`flex items-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all border ${
                        isFilterPanelOpen 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                    }`}
                >
                    <AiOutlineFilter size={20} /> Filtres avancés
                </button>
                
                {selectedMembers.length > 0 && (
                    <div className="md:ml-auto flex items-center gap-3 bg-red-100 p-3 rounded-xl">
                        <span className="font-semibold text-red-600">{selectedMembers.length} sélectionné(s)</span>
                        <Button 
                            onClick={() => setIsDeletePopupOpen(true)} 
                            variant="danger" 
                            className="bg-white hover:bg-red-50 text-sm py-2"
                        >
                            <AiOutlineDelete size={18} /> Supprimer
                        </Button>
                    </div>
                )}
            </div>

            <div className={`bg-white rounded-2xl shadow-lg border border-red-50 mb-8 transition-all duration-500 overflow-hidden ${
                isFilterPanelOpen ? "max-h-[500px] p-6 opacity-100" : "max-h-0 opacity-0 p-0"
            }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
                        <div className="flex gap-2">
                            <button onClick={() => setFilterSex("")} className={`flex-1 py-2 text-sm rounded-lg border transition ${filterSex === "" ? "bg-red-500 text-white" : "bg-gray-100"}`}>Tous</button>
                            <button onClick={() => setFilterSex("MALE")} className={`flex-1 py-2 text-sm rounded-lg border transition ${filterSex === "MALE" ? "bg-red-500 text-white" : "bg-gray-100"}`}><AiOutlineMan className="inline"/> H</button>
                            <button onClick={() => setFilterSex("FEMALE")} className={`flex-1 py-2 text-sm rounded-lg border transition ${filterSex === "FEMALE" ? "bg-red-500 text-white" : "bg-gray-100"}`}><AiOutlineWoman className="inline"/> F</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Situation</label>
                        <select className="w-full border border-gray-300 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-white">
                            <option value="">Toutes</option>
                            {SITUATIONS.map((s) => (
                                <option key={String(s)} value={String(s)}>{String(s)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tribu</label>
                        <select 
                            value={filterTribe}
                            onChange={(e) => setFilterTribe(e.target.value)}
                            className="w-full border border-gray-300 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        >
                            <option value="">Toutes les tribus</option>
                            {TRIBES.map((t) => (
                                <option key={String(t)} value={String(t)}>{String(t)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cotisation</label>
                        <select 
                            value={filterCotisation}
                            onChange={(e) => setFilterCotisation(e.target.value)}
                            className="w-full border border-gray-300 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        >
                            <option value="">Tous les statuts</option>
                            {COTISATION_STATUSES.map((c) => (
                                <option key={String(c)} value={String(c)}>{String(c)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleResetFilters} className="text-red-500 hover:text-red-700 font-semibold transition">
                        Réinitialiser tous les filtres
                    </button>
                </div>
            </div>

            {/* Tableau des Membres */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-left">
                        <thead className="bg-red-50 text-red-700 uppercase text-sm font-bold">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        checked={selectedMembers.length === members.length && members.length > 0}
                                        className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                                    />
                                </th>
                                <th className="p-4">Membre</th>
                                <th className="p-4 hidden sm:table-cell">Téléphone</th>
                                <th className="p-4 hidden md:table-cell"><AiOutlineTeam className="inline mr-1" /> Tribu</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-center"><AiOutlineDollarCircle className="inline mr-1" /> Cotisation</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {members.map(member => (
                                <tr key={member.id} className={`transition-all ${selectedMembers.includes(member.id) ? "bg-red-50/50" : "hover:bg-gray-50"}`}>
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedMembers.includes(member.id)}
                                            onChange={() => handleSelect(member.id)}
                                            className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-4 flex items-center gap-3">
                                        <img 
                                            src={member.imageUrl || 'https://via.placeholder.com/40'} 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-red-200 shadow-sm" 
                                            alt="avatar" 
                                        />
                                        <div>
                                            <p className="font-bold text-gray-800 leading-tight">{member.firstName} {member.lastName}</p>
                                            <p className="text-xs text-gray-500 font-medium">{member.quartier}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden sm:table-cell text-gray-600 text-sm font-medium">{member.phoneNumber}</td>
                                    <td className="p-4 hidden md:table-cell text-gray-700 font-medium">{member.tribe}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full bg-blue-100 text-blue-700">
                                            {member.statusSocial}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <CotisationIcon status={member.cotisationStatus} />
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button 
                                            onClick={() => setMemberToView(member)} 
                                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                                            title="Voir détails"
                                        >
                                            <AiOutlineEye size={18} />
                                        </button>
                                        <button 
                                            className="p-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-500 hover:text-white transition-all transform hover:scale-110"
                                            title="Modifier"
                                        >
                                            <AiOutlineEdit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setIsDeletePopupOpen(true)} 
                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                            title="Supprimer"
                                        >
                                            <AiOutlineDelete size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {members.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-medium italic">
                        Aucun membre trouvé correspondant à vos critères.
                    </div>
                )}
            </div>
            <Popup 
              isOpen={!!memberToView} 
              member={memberToView} 
              onClose={() => setMemberToView(null)} 
            />

            <Alert
              isOpen={isDeletePopupOpen}
              variant="danger"
              title="Confirmer la suppression"
              message={`Êtes-vous sûr de vouloir supprimer ${selectedMembers.length} membre(s) ? Cette action est irréversible.`}
              onConfirm={() => {
                  deleteAction(selectedMembers);
                  setIsDeletePopupOpen(false);
              }}
              onClose={() => setIsDeletePopupOpen(false)}
            />
        </div>
    );
};

export default MemberPage;