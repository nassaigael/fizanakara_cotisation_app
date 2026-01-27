import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineDollar, AiOutlineArrowRight, AiOutlineCheck } from "react-icons/ai";
import { useContribution } from "../hooks/useContribution";
import { usePayment } from "../hooks/usePayment";
import { THEME } from "../styles/theme";
import Button from "../components/shared/Button";

const ContributionManagement: React.FC = () => {
    const { contributions, search, setSearch, refresh, loading } = useContribution();
    const { processPayment, isSubmitting } = usePayment(refresh);
    
    const [inputAmounts, setInputAmounts] = useState<Record<string, string>>({});

    const handleAmountChange = (id: string, value: string) => {
        setInputAmounts(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="h-screen flex flex-col bg-brand-bg/20 overflow-hidden">
            <header className="p-6 bg-white border-b-2 border-brand-border shrink-0">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className={`text-2xl ${THEME.font.black} text-brand-text uppercase`}>Saisie des Cotisations</h1>
                        <p className="text-[10px] font-bold text-brand-muted uppercase italic">Enregistrement des versements - Année {new Date().getFullYear()}</p>
                    </div>
                    <div className="bg-brand-primary/10 px-4 py-2 rounded-2xl border-2 border-brand-primary border-b-4">
                        <span className="text-[10px] font-black text-brand-primary uppercase">Membres éligibles: {contributions.length}</span>
                    </div>
                </div>
            </header>

            <div className="px-6 py-4 bg-white/50 border-b border-brand-border shrink-0">
                <div className="max-w-7xl mx-auto relative">
                    <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un membre par nom..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-white rounded-3xl border-2 border-brand-border font-bold text-sm focus:border-brand-primary transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Liste de saisie */}
            <main className="flex-1 overflow-hidden p-6">
                <div className="max-w-7xl mx-auto h-full bg-white rounded-[2.5rem] border-2 border-brand-border shadow-xl flex flex-col overflow-hidden">
                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-brand-bg/50 backdrop-blur-md z-10 border-b-2 border-brand-border">
                                <tr>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted tracking-widest">Membre</th>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted tracking-widest text-center">Total Dû</th>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted tracking-widest text-center">Déjà Payé</th>
                                    <th className="p-5 text-[9px] font-black uppercase text-brand-muted tracking-widest text-center">Reste</th>
                                    <th className="p-5 text-right text-[9px] font-black uppercase text-brand-muted tracking-widest w-62.5">Encaisser</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-bg">
                                {contributions.map((c) => (
                                    <tr key={c.id} className="hover:bg-brand-bg/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-black text-[11px] uppercase text-brand-text">{c.memberName}</div>
                                            <div className={`text-[8px] font-bold uppercase ${c.remaining === 0 ? 'text-green-500' : 'text-brand-muted'}`}>
                                                {c.remaining === 0 ? 'Soldé' : 'Cotisation annuelle'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center font-bold text-xs text-brand-text">
                                            {c.amount.toLocaleString()} <span className="text-[8px] opacity-50">AR</span>
                                        </td>
                                        <td className="p-4 text-center font-bold text-xs text-green-600">
                                            {c.totalPaid.toLocaleString()} <span className="text-[8px] opacity-50">AR</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full font-black text-[10px] ${c.remaining > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                {c.remaining.toLocaleString()} Ar
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        placeholder="Somme..."
                                                        disabled={c.remaining === 0}
                                                        className="w-32 py-2 px-3 bg-brand-bg rounded-xl border-2 border-brand-border font-black text-xs text-brand-primary focus:border-brand-primary outline-none disabled:opacity-30"
                                                        value={inputAmounts[c.id] || ""}
                                                        onChange={(e) => handleAmountChange(c.id, e.target.value)}
                                                    />
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        processPayment(c, Number(inputAmounts[c.id]));
                                                        handleAmountChange(c.id, ""); // Reset input après validation
                                                    }}
                                                    disabled={!inputAmounts[c.id] || isSubmitting || c.remaining === 0}
                                                    className="bg-brand-primary text-white p-2.5 rounded-xl shadow-lg shadow-brand-primary/30 active:scale-95 disabled:opacity-30 transition-all"
                                                >
                                                    <AiOutlineCheck size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Footer de synthèse rapide */}
            <footer className="p-4 bg-white border-t-2 border-brand-border shrink-0">
                <div className="max-w-7xl mx-auto flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-brand-muted">
                    <span>Fizanakara Payment Terminal v1.0</span>
                    <span className="text-brand-primary animate-pulse">Mode Online • Sync Actif</span>
                </div>
            </footer>
        </div>
    );
};

export default ContributionManagement;