import React, { useState } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineDelete, AiOutlineEdit,
  AiOutlinePlus, AiOutlineFilter, AiOutlineDollarCircle 
} from "react-icons/ai";

import { 
  Alert, Popup, Button, ActionButton, 
  MemberFormModal, PaymentModal, FilterSelect 
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
        form: boolean, edit: MemberType | null, view: MemberType | null, payment: MemberType | null
    }>({ form: false, edit: null, view: null, payment: null });

    const [alert, setAlert] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });

    if (loading) return <div className="p-20 text-center font-black text-brand-muted animate-pulse">CHARGEMENT...</div>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl ${THEME.font.black} text-brand-text uppercase`}>Membres</h1>
                    <p className="text-brand-muted font-bold text-xs uppercase opacity-60">Gestion de la base Fizanakara</p>
                </div>
                <Button onClick={() => setModals({...modals, form: true, edit: null})} variant="primary">
                    <AiOutlinePlus className="mr-2" size={20}/> Nouveau Membre
                </Button>
            </div>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20}/>
                    <input 
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un nom, téléphone..." className={THEME.input + " pl-12"} 
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className={`flex items-center gap-2 px-6 py-3 border-2 rounded-2xl font-black text-[10px] transition-all ${isFilterOpen ? 'bg-brand-text text-white border-brand-text' : 'bg-white border-brand-border text-brand-text'}`}
                >
                    <AiOutlineFilter size={18}/> {isFilterOpen ? 'FERMER' : 'FILTRES'}
                </button>
            </div>

            {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-brand-bg rounded-3xl border-2 border-brand-border animate-in slide-in-from-top-2">
                    <FilterSelect 
                        label="Genre" 
                        value={filterSex} 
                        onChange={setFilterSex} 
                        options={[{l:'Homme', v:'MALE'}, {l:'Femme', v:'FEMALE'}]} 
                    />
                    <FilterSelect 
                        label="Quartier" 
                        value={filterDistrict} 
                        onChange={setFilterDistrict} 
                        options={[]}
                    />
                    <FilterSelect 
                        label="Tribu" 
                        value={filterTribe} 
                        onChange={setFilterTribe} 
                        options={[]}
                    />
                    <FilterSelect 
                        label="État Caisse" 
                        value={filterCotisation} 
                        onChange={setFilterCotisation} 
                        options={[{l:'À jour', v:'Payé'}, {l:'En retard', v:'En cours'}]} 
                    />
                </div>
            )}

            {/* TABLEAU - Correction Tailwind: rounded-4xl au lieu de rounded-[2rem] */}
            <div className="bg-white border-2 border-brand-border rounded-4xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-brand-bg border-b-2 border-brand-border">
                        <tr className={`text-[10px] ${THEME.font.black} text-brand-muted uppercase`}>
                            <th className="p-4 w-12 text-center">
                                <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} />
                            </th>
                            <th className="p-4 text-left">Membre</th>
                            <th className="p-4 text-left">Localisation</th>
                            <th className="p-4 text-left">Caisse (Ar)</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => {
                            const { paye, reste } = getFinancials(m);
                            return (
                                <tr key={m.id} className="border-b border-brand-bg hover:bg-brand-bg/5 transition-colors">
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedMembers.includes(String(m.id))} 
                                            onChange={() => handleSelect(String(m.id))} 
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={getImageUrl(m.imageUrl, m.firstName)} className="w-10 h-10 rounded-lg object-cover border-2 border-brand-border shadow-sm" alt="" />
                                            <div>
                                                <div className="font-black text-xs uppercase leading-tight">{m.firstName} {m.lastName}</div>
                                                <div className="text-[9px] text-brand-primary font-bold">{m.phoneNumber || "SANS CONTACT"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase">{m.district?.name || "-"}</span>
                                            <span className="text-[9px] font-bold text-brand-muted uppercase">{m.tribute?.name || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-[10px] font-black text-green-600">{paye.toLocaleString()}</div>
                                        {reste > 0 && (
                                            <div className="text-[9px] font-bold text-red-500 italic">Reste: {reste.toLocaleString()}</div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton icon={<AiOutlineDollarCircle/>} onClick={() => setModals({...modals, payment: m})} title="Paiement" />
                                            <ActionButton icon={<AiOutlineEye/>} onClick={() => setModals({...modals, view: m})} title="Voir" />
                                            <ActionButton icon={<AiOutlineEdit/>} onClick={() => setModals({...modals, edit: m, form: true})} title="Modifier" />
                                            <ActionButton icon={<AiOutlineDelete/>} onClick={() => setAlert({
                                                isOpen: true, title: "SUPPRESSION", message: `Supprimer ${m.firstName} ?`,
                                                onConfirm: () => deleteAction([String(m.id)])
                                            })} color="hover:text-red-500" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <MemberFormModal 
                isOpen={modals.form} 
                memberToEdit={modals.edit} 
                onClose={() => setModals({...modals, form: false})} 
                onSuccess={refreshMembers} 
            />
            {modals.view && <Popup isOpen={true} member={modals.view} onClose={() => setModals({...modals, view: null})} />}
            {modals.payment && <PaymentModal member={modals.payment} onClose={() => setModals({...modals, payment: null})} onSuccess={refreshMembers} />}
            <Alert {...alert} onClose={() => setAlert({...alert, isOpen: false})} />
        </div>
    );
};

export default Member;