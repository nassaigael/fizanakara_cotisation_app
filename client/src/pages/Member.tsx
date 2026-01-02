import React, { useState, useEffect, useCallback } from "react";
import { 
  AiOutlineSearch, AiOutlineEye, AiOutlineDelete, AiOutlineEdit,
  AiOutlinePlus, AiOutlineFilter, AiOutlineSetting,
  AiOutlineDollarCircle
} from "react-icons/ai";

import { useMemberLogic } from "../hooks/useMemberLogic";
import { THEME } from "../styles/theme";
import Button from "../components/ui/Button"; 
import Alert from "../components/ui/Alert";
import Popup from "../components/ui/Popup";
import MemberFormalModal from "../components/ui/MemberFormModal";
import { memberService } from "../services/memberService";
import { getImageUrl } from "../utils/constants/constants";
import type { Member as MemberType, Tribute, District } from "../utils/types/types";

const Member: React.FC = () => {
    const COTISATION_FIXE = 50000;
    const { 
        members, loading, search, setSearch, filterSex, setFilterSex,
        filterDistrict, setFilterDistrict, filterTribe, setFilterTribe,
        filterCotisation, setFilterCotisation, selectedMembers, 
        handleSelect, handleSelectAll, deleteAction, refreshMembers, fullResetAction 
    } = useMemberLogic();

    const [filters, setFilters] = useState<{tributes: Tribute[], districts: District[]}>({ tributes: [], districts: [] });
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [showHiddenReset, setShowHiddenReset] = useState(false);
    
    const [modals, setModals] = useState<{
        form: boolean, 
        edit: MemberType | null, 
        view: MemberType | null,
        payment: MemberType | null
    }>({ form: false, edit: null, view: null, payment: null });

    const [alertConfig, setAlertConfig] = useState<any>({ isOpen: false });

    const loadFilterData = useCallback(async () => {
        try {
            const [tData, dData] = await Promise.all([
                memberService.getTributes(), 
                memberService.getDistricts()
            ]);
            const unique = (arr: any[]) => arr.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
            setFilters({ tributes: unique(tData), districts: unique(dData) });
        } catch (err) { 
            console.error("Erreur chargement filtres:", err); 
        }
    }, []);

    useEffect(() => { loadFilterData(); }, [loadFilterData, members]);

    // ✅ TYPAGE : Calcul financier sécurisé
    const getFinancials = (member: MemberType) => {
        const paye = member.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
        const reste = Math.max(0, COTISATION_FIXE - paye);
        return { paye, reste };
    };

    const triggerAlert = (title: string, message: string, onConfirm: () => void) => {
        setAlertConfig({ 
            isOpen: true, title, message, variant: "danger", 
            onConfirm: () => { onConfirm(); setAlertConfig({isOpen: false}); } 
        });
    };

    if (loading) return (
        <div className="p-10 text-center font-black text-brand-muted uppercase tracking-widest animate-pulse">
            Synchronisation avec le Backend...
        </div>
    );

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div onClick={() => setShowHiddenReset(!showHiddenReset)} className="cursor-pointer select-none">
                    <h1 className={`text-3xl ${THEME.font.black} text-brand-text uppercase`}>Annuaire & Caisse</h1>
                    <p className="text-brand-muted font-bold text-sm tracking-tight">Fizanakara • Gestion des Cotisations</p>
                </div>
                <div className="flex gap-2">
                    {showHiddenReset && (
                        <Button onClick={() => triggerAlert("RÉINITIALISATION", "Vider toute la base ?", fullResetAction)} variant="secondary" className="h-12 px-4 border-red-500 text-red-500 bg-red-50">
                            <AiOutlineSetting size={20} />
                        </Button>
                    )}
                    <Button onClick={() => setModals({...modals, edit: null, form: true})} variant="primary" className="h-12 px-6">
                        <AiOutlinePlus size={20} className="mr-2" /> <span>Nouveau Membre</span>
                    </Button>
                </div>
            </div>

            {/* --- RECHERCHE ET FILTRES --- */}
            <div className="flex gap-4">
                <div className="relative flex-1 group">
                    <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Chercher un nom ou téléphone..." 
                        value={search} 
                        className={THEME.input + " pl-12"} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
                <button 
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} 
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl ${THEME.font.black} text-[11px] border-2 border-b-4 transition-all ${isFilterPanelOpen ? 'bg-brand-text text-white' : 'bg-white text-brand-muted border-brand-border'}`}
                >
                    <AiOutlineFilter size={20} /> FILTRES
                </button>
            </div>

            {/* --- PANNEAU DE FILTRES --- */}
            {isFilterPanelOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-brand-bg rounded-3xl border-2 border-brand-border shadow-inner animate-in slide-in-from-top-2">
                    <FilterSelect label="Genre" value={filterSex} onChange={setFilterSex} options={[{l:'Homme', v:'MALE'}, {l:'Femme', v:'FEMALE'}]} />
                    <FilterSelect label="Quartier" value={filterDistrict} onChange={setFilterDistrict} options={filters.districts.map(d => ({l:d.name, v:d.name}))} />
                    <FilterSelect label="Tribu" value={filterTribe} onChange={setFilterTribe} options={filters.tributes.map(t => ({l:t.name, v:t.name}))} />
                    <FilterSelect label="État Caisse" value={filterCotisation} onChange={setFilterCotisation} options={[{l:'À jour', v:'Payé'}, {l:'En retard', v:'En cours'}]} />
                </div>
            )}

            {/* --- TABLEAU DES MEMBRES --- */}
            <div className={`${THEME.card} bg-white overflow-hidden border-2 border-brand-border shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-brand-bg border-b-2 border-brand-border">
                            <tr className={`text-[10px] ${THEME.font.black} text-brand-muted uppercase tracking-widest`}>
                                <th className="p-5 w-14 text-center">
                                    <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} className="w-5 h-5 accent-brand-primary cursor-pointer" />
                                </th>
                                <th className="p-5">Membre</th>
                                <th className="p-5">Localisation</th>
                                <th className="p-5">Situation Caisse (Ar)</th>
                                <th className="p-5 text-right px-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-brand-bg">
                            {members.map(member => {
                                const { paye, reste } = getFinancials(member);
                                return (
                                    <tr key={member.id} className="group hover:bg-brand-primary/5 transition-colors">
                                        <td className="p-5 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedMembers.includes(String(member.id))} 
                                                onChange={() => handleSelect(String(member.id))} 
                                                className="w-5 h-5 accent-brand-primary cursor-pointer" 
                                            />
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl border-2 border-brand-border overflow-hidden shrink-0">
                                                    <img src={getImageUrl(member.imageUrl, member.firstName)} className="w-full h-full object-cover" alt=""/>
                                                    <div className="absolute bottom-0 inset-x-0 bg-brand-text/60 text-[7px] text-white text-center py-0.5 font-black uppercase">MBR</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="font-black text-brand-text text-sm uppercase leading-tight">{member.firstName} {member.lastName}</div>
                                                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">{member.phoneNumber || "SANS CONTACT"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col leading-tight">
                                                <span className="text-[11px] font-black text-brand-text uppercase">{member.district?.name || "N/A"}</span>
                                                <span className="text-[10px] font-bold text-brand-muted uppercase">{member.tribute?.name || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center w-32">
                                                    <span className="text-[9px] font-black text-green-600 uppercase">Payé:</span>
                                                    <span className="text-[10px] font-black">{paye.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center w-32 p-1 bg-red-50 rounded-lg border border-red-100">
                                                    <span className="text-[9px] font-black text-red-500 uppercase italic">Reste:</span>
                                                    <span className="text-[10px] font-black text-red-600">{reste.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right px-10">
                                            <div className="flex justify-end gap-2">
                                                <ActionButton 
                                                    icon={<AiOutlineDollarCircle/>} 
                                                    onClick={() => setModals({...modals, payment: member})} 
                                                    color="hover:bg-green-500 hover:text-white" 
                                                    title="Encaisser"
                                                />
                                                <ActionButton icon={<AiOutlineEye/>} onClick={() => setModals({...modals, view: member})} />
                                                <ActionButton icon={<AiOutlineEdit/>} onClick={() => setModals({...modals, edit: member, form: true})} color="hover:text-blue-500" />
                                                <ActionButton icon={<AiOutlineDelete/>} onClick={() => triggerAlert("SUPPRESSION", `Supprimer ${member.firstName} ?`, () => deleteAction([String(member.id)]))} color="hover:text-red-500" />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALES --- */}
            <MemberFormalModal isOpen={modals.form} onClose={() => setModals({...modals, form: false})} memberToEdit={modals.edit} onSuccess={refreshMembers} />
            <Alert {...alertConfig} onClose={() => setAlertConfig({...alertConfig, isOpen: false})} />
            {modals.view && <Popup isOpen={true} member={modals.view} onClose={() => setModals({...modals, view: null})} />}
            
            {modals.payment && (
                <PaymentModal 
                    member={modals.payment} 
                    onClose={() => setModals({...modals, payment: null})} 
                    onSuccess={refreshMembers}
                />
            )}
        </div>
    );
};

// --- COMPOSANT : MODAL DE PAIEMENT TYPÉ ---
interface PaymentModalProps {
    member: MemberType;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ member, onClose, onSuccess }) => {
    const [amount, setAmount] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (amount <= 0) return alert("Entrez un montant valide");
        setIsSaving(true);
        try {
            // ✅ Utilise la méthode update existante pour ajouter un paiement
            await memberService.update(member.id, {
                ...member,
                newPayment: { 
                    amount, 
                    date: new Date().toISOString()
                }
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Erreur de paiement:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] border-2 border-b-8 border-brand-border p-8 animate-in zoom-in-95 duration-200 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-green-100 text-green-600 rounded-2xl border-2 border-green-200"><AiOutlineDollarCircle size={32}/></div>
                    <div>
                        <h3 className={`text-xl ${THEME.font.black} text-brand-text uppercase leading-none`}>Encaisser</h3>
                        <p className="text-[10px] font-bold text-brand-muted uppercase mt-1">{member.firstName} {member.lastName}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-brand-muted uppercase mb-2 ml-2">Montant du versement (Ar)</label>
                        <input 
                            type="number" 
                            autoFocus
                            className={THEME.input + " text-2xl text-center font-black text-brand-primary"}
                            placeholder="0"
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <button onClick={onClose} className="py-4 rounded-2xl border-2 border-brand-border font-black text-[11px] uppercase hover:bg-brand-bg transition-all">Annuler</button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="py-4 rounded-2xl bg-brand-primary border-2 border-brand-primary-dark border-b-6 text-white font-black text-[11px] uppercase hover:brightness-110 active:border-b-2 transition-all disabled:opacity-50"
                        >
                            {isSaving ? "Traitement..." : "Confirmer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANTS INTERNES UTILITAIRES ---
const FilterSelect = ({ label, value, onChange, options }: any) => (
    <div className="space-y-1">
        <label className={`block text-[10px] ${THEME.font.black} text-brand-muted uppercase ml-1`}>{label}</label>
        <div className="relative">
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-white border-2 border-brand-border p-2.5 rounded-xl font-bold text-sm outline-none focus:border-brand-primary shadow-sm appearance-none cursor-pointer"
            >
                <option value="">Tous</option>
                {options.map((o: any) => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted opacity-50">▼</div>
        </div>
    </div>
);

const ActionButton = ({ icon, onClick, color = "hover:text-brand-primary", title }: any) => (
    <button 
        title={title} 
        onClick={onClick} 
        className={`p-2.5 border-2 border-b-4 border-brand-border rounded-xl transition-all active:translate-y-0.5 active:border-b-2 bg-white ${color}`}
    >
        {React.cloneElement(icon, { size: 18 })}
    </button>
);

export default Member;