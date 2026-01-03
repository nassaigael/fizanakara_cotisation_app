
import React, { useState, useMemo } from "react";
import { AiOutlineDollarCircle, AiOutlineSearch, AiOutlineFilter, AiOutlineHistory } from "react-icons/ai";
import { useMemberLogic } from "../hooks/useMemberLogic";
import { getFinancials } from "../utils/FinanceHelper";
import { THEME } from "../styles/theme";
import { ActionButton, PaymentModal, FilterSelect } from "../components";
import { getImageUrl } from "../utils/constants/constants";

const Cotisation: React.FC = () => {
    const { 
        members, loading, search, setSearch, 
        filterDistrict, setFilterDistrict, 
        filterCotisation, setFilterCotisation, 
        refreshMembers 
    } = useMemberLogic();

    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const stats = useMemo(() => {
        const total = members.reduce((acc, m) => {
            const { paye, reste } = getFinancials(m);
            return { 
                paye: acc.paye + paye, 
                reste: acc.reste + reste 
            };
        }, { paye: 0, reste: 0 });
        
        return total;
    }, [members]);

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-brand-muted uppercase text-xs">Chargement des finances...</div>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className={`text-4xl ${THEME.font.black} text-brand-text uppercase`}>Cotisations</h1>
                    <p className="text-brand-muted font-bold text-[10px] uppercase mt-1">Suivi des encaissements Annuels</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl text-center min-w-[140px]">
                        <p className="text-[9px] font-black text-green-600 uppercase">Total Encaissé</p>
                        <p className="text-xl font-black text-green-700">{stats.paye.toLocaleString()} <span className="text-[10px]">Ar</span></p>
                    </div>
                    <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl text-center min-w-[140px]">
                        <p className="text-[9px] font-black text-red-600 uppercase">Reste à Percevoir</p>
                        <p className="text-xl font-black text-red-700">{stats.reste.toLocaleString()} <span className="text-[10px]">Ar</span></p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 bg-white p-2 rounded-2xl border-2 border-brand-border shadow-sm">
                <div className="relative flex-1">
                    <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20}/>
                    <input 
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un membre pour un paiement..." 
                        className="w-full pl-12 pr-4 py-3 bg-transparent outline-none font-bold text-sm" 
                    />
                </div>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-6 rounded-xl flex items-center gap-2 font-black text-[10px] transition-all ${isFilterOpen ? 'bg-brand-text text-white' : 'bg-brand-bg text-brand-text'}`}
                >
                    <AiOutlineFilter size={16}/> {isFilterOpen ? 'FERMER' : 'FILTRER'}
                </button>
            </div>

            {isFilterOpen && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <FilterSelect 
                        label="Filtrer par Quartier" 
                        value={filterDistrict} 
                        onChange={setFilterDistrict} 
                        options={Array.from(new Set(members.map(m => m.districtName || m.district?.name).filter(Boolean))).map(n => ({l: n as string, v: n as string}))} 
                    />
                    <FilterSelect 
                        label="État du Paiement" 
                        value={filterCotisation} 
                        onChange={setFilterCotisation} 
                        options={[{l:'À jour', v:'Payé'}, {l:'En retard', v:'En cours'}]} 
                    />
                </div>
            )}
            <div className="bg-white border-2 border-brand-border rounded-4xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-brand-bg border-b-2 border-brand-border">
                        <tr className="text-[10px] font-black text-brand-muted uppercase">
                            <th className="p-5 text-left">Membre</th>
                            <th className="p-5 text-center">Statut Type</th>
                            <th className="p-5 text-right">Montant Dû</th>
                            <th className="p-5 text-right">Déjà Payé</th>
                            <th className="p-5 text-right">Reste</th>
                            <th className="p-5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-bg">
                        {members.map(m => {
                            const { paye, reste, montantDu } = getFinancials(m);
                            return (
                                <tr key={m.id} className="hover:bg-brand-bg/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={getImageUrl(m.imageUrl, m.firstName)} className="w-10 h-10 rounded-xl object-cover border-2 border-brand-border" alt="" />
                                            <div className="font-black text-xs uppercase">{m.firstName} {m.lastName}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="px-3 py-1 bg-brand-bg rounded-full text-[9px] font-black text-brand-text uppercase">
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-xs">{montantDu.toLocaleString()}</td>
                                    <td className="p-4 text-right font-black text-xs text-green-600">{paye.toLocaleString()}</td>
                                    <td className="p-4 text-right font-black text-xs text-red-500">
                                        {reste > 0 ? `${reste.toLocaleString()} Ar` : "SOLDE"}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <ActionButton 
                                                icon={<AiOutlineDollarCircle/>} 
                                                onClick={() => setSelectedMember(m)} 
                                                title="Encaisser"
                                                className={reste <= 0 ? "opacity-20 pointer-events-none" : "bg-green-500 text-white border-none shadow-md"}
                                            />
                                            <ActionButton 
                                                icon={<AiOutlineHistory/>} 
                                                onClick={() => {/* Logique pour voir historique */}} 
                                                title="Historique"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {selectedMember && (
                <PaymentModal 
                    isOpen={!!selectedMember}
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                    onSuccess={refreshMembers}
                />
            )}
        </div>
    );
};

export default Cotisation;