import React, { useState, useMemo } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineDelete, AiOutlineEdit,
  AiOutlinePlus, AiOutlineFilter 
} from "react-icons/ai";

import { 
  Alert, Popup, Button, ActionButton, 
  MemberFormModal, FilterSelect 
} from "../components"; 

import { useMemberLogic } from "../hooks/useMemberLogic";
import { getImageUrl } from "../utils/constants/constants";
import { getFinancials } from "../utils/FinanceHelper";
import { THEME } from "../styles/theme";
import type { Member as MemberType } from "../utils/types/types";

const Member: React.FC = () => {
    const { 
        members, loading, search, setSearch, 
        filterSex, setFilterSex, 
        filterDistrict, setFilterDistrict, 
        filterTribe, setFilterTribe, 
        filterCotisation, setFilterCotisation, 
        selectedMembers, handleSelect, handleSelectAll, 
        deleteAction, refreshMembers 
    } = useMemberLogic();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [modals, setModals] = useState<{
        form: boolean, edit: MemberType | null, view: MemberType | null
    }>({ form: false, edit: null, view: null });

    const [alert, setAlert] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });
    const districtOptions = useMemo(() => 
        Array.from(new Set(members.map(m => m.districtName || m.district?.name).filter(Boolean)))
            .map(name => ({ l: name as string, v: name as string })), 
    [members]);

    const tributeOptions = useMemo(() => 
        Array.from(new Set(members.map(m => m.tributeName || m.tribute?.name).filter(Boolean)))
            .map(name => ({ l: name as string, v: name as string })), 
    [members]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-brand-muted uppercase text-xs tracking-widest">Synchronisation...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className={`text-4xl ${THEME.font.black} text-brand-text uppercase leading-none`}>Membres</h1>
                    <p className="text-brand-muted font-bold text-[10px] uppercase mt-2 tracking-widest opacity-60">
                        Base de données Fizanakara
                    </p>
                </div>
                <Button onClick={() => setModals({...modals, form: true, edit: null})} variant="primary">
                    <AiOutlinePlus className="mr-2" size={20}/> Nouveau Membre
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <AiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted" size={20}/>
                    <input 
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par nom, matricule ou téléphone..." 
                        className={THEME.input + " pl-14 h-14 rounded-2xl shadow-sm"} 
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className={`flex items-center gap-2 px-8 py-4 border-2 rounded-2xl font-black text-[10px] transition-all duration-300 ${
                        isFilterOpen ? 'bg-brand-text text-white border-brand-text shadow-lg' : 'bg-white border-brand-border text-brand-text hover:bg-brand-bg'
                    }`}
                >
                    <AiOutlineFilter size={18}/> {isFilterOpen ? 'FERMER' : 'FILTRES'}
                </button>
            </div>
            {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border-2 border-brand-border animate-in slide-in-from-top-4 duration-300 shadow-xl">
                    <FilterSelect label="Genre" value={filterSex} onChange={setFilterSex} options={[{l:'Homme', v:'MALE'}, {l:'Femme', v:'FEMALE'}]} />
                    <FilterSelect label="Quartier" value={filterDistrict} onChange={setFilterDistrict} options={districtOptions} />
                    <FilterSelect label="Tribu" value={filterTribe} onChange={setFilterTribe} options={tributeOptions} />
                    <FilterSelect label="État Caisse" value={filterCotisation} onChange={setFilterCotisation} options={[{l:'À jour', v:'Payé'}, {l:'En retard', v:'En cours'}]} />
                </div>
            )}
            {selectedMembers.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full font-black text-xs shadow-md">
                            {selectedMembers.length}
                        </span>
                        <p className="text-[11px] font-black text-red-700 uppercase">Sélectionnés</p>
                    </div>
                    <button 
                        onClick={() => setAlert({
                            isOpen: true, 
                            title: "SUPPRESSION MULTIPLE", 
                            message: `Confirmer la suppression de ${selectedMembers.length} membres ?`,
                            onConfirm: () => deleteAction(selectedMembers)
                        })}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] hover:bg-red-700 transition-all shadow-md active:scale-95"
                    >
                        SUPPRIMER DÉFINITIVEMENT
                    </button>
                </div>
            )}
            <div className="bg-white border-2 border-brand-border rounded-[2.5rem] shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-brand-bg/50 border-b-2 border-brand-border">
                        <tr className={`text-[10px] ${THEME.font.black} text-brand-muted uppercase tracking-widest`}>
                            <th className="p-5 w-14 text-center">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                                    onChange={(e) => handleSelectAll(e.target.checked)} 
                                />
                            </th>
                            <th className="p-5 text-left">Membre</th>
                            <th className="p-5 text-left">Localisation</th>
                            <th className="p-5 text-left">Cotisation</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-bg">
                        {members.length > 0 ? members.map(m => {
                            const { paye, reste } = getFinancials(m);
                            return (
                                <tr key={m.id} className="group hover:bg-brand-bg/30 transition-all duration-200">
                                    <td className="p-5 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedMembers.includes(String(m.id))} 
                                            onChange={() => handleSelect(String(m.id))}
                                            className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                                        />
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={getImageUrl(m.imageUrl, m.firstName)} 
                                                className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-border shadow-sm group-hover:scale-105 transition-transform" 
                                                alt="" 
                                            />
                                            <div>
                                                <div className="font-black text-sm text-brand-text uppercase leading-tight">{m.firstName} {m.lastName}</div>
                                                <div className="text-[10px] text-brand-primary font-bold mt-0.5">{m.phoneNumber || "SANS CONTACT"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-brand-text uppercase">
                                                {m.districtName || m.district?.name || "N/A"}
                                            </span>
                                            <span className="text-[9px] font-bold text-brand-muted uppercase">
                                                {m.tributeName || m.tribute?.name || "N/A"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className={`inline-flex flex-col px-3 py-1 rounded-lg ${reste <= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                            <span className={`text-[10px] font-black ${reste <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {paye.toLocaleString()} Ar
                                            </span>
                                            {reste > 0 && (
                                                <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">
                                                    Reste: {reste.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton icon={<AiOutlineEye/>} onClick={() => setModals({...modals, view: m})} title="Voir Fiche" />
                                            <ActionButton icon={<AiOutlineEdit/>} onClick={() => setModals({...modals, edit: m, form: true})} title="Modifier" />
                                            <ActionButton icon={<AiOutlineDelete/>} onClick={() => setAlert({
                                                isOpen: true, title: "SUPPRESSION", message: `Supprimer ${m.firstName} ?`,
                                                onConfirm: () => deleteAction([String(m.id)])
                                            })} color="hover:text-red-500 hover:bg-red-50" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-brand-muted font-bold uppercase text-[10px] tracking-widest">
                                    Aucun membre trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <MemberFormModal 
                isOpen={modals.form} 
                memberToEdit={modals.edit} 
                onClose={() => setModals({...modals, form: false})} 
                onSuccess={refreshMembers} 
            />
            
            {modals.view && (
                <Popup 
                    isOpen={true} 
                    member={modals.view} 
                    onClose={() => setModals({...modals, view: null})} 
                />
            )}

            <Alert {...alert} onClose={() => setAlert({...alert, isOpen: false})} />
        </div>
    );
};

export default Member;