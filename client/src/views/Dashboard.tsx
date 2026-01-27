import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AiOutlineUsergroupAdd, AiOutlineSearch, AiOutlineArrowRight, 
  AiOutlineGlobal, AiOutlineTeam, AiOutlineHistory,
  AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineWarning, AiOutlineCalendar
} from 'react-icons/ai';
import { useMemberLogic } from '../hooks/useMembers';
import { useContribution } from '../hooks/useContribution';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // ÉTAT DE L'ANNÉE (La "Time Machine" du Dashboard)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const { allMembers } = useMemberLogic();
    const { contributions, loading } = useContribution(selectedYear);
    const [searchTerm, setSearchTerm] = useState("");
    const [showGeoModal, setShowGeoModal] = useState(false);

    // CALCUL DES STATS SELON L'ANNÉE SÉLECTIONNÉE
    const stats = useMemo(() => {
        // 1. Filtrer les membres qui étaient déjà inscrits à cette année là
        const membersAtYear = allMembers.filter(m => {
            const creationYear = new Date(m.createdAt).getFullYear();
            return creationYear <= selectedYear;
        });

        // 2. Calculs financiers
        const totalPaid = contributions.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);
        const totalRemaining = contributions.reduce((acc, curr) => acc + (curr.remaining || 0), 0);
        const totalExpected = totalPaid + totalRemaining;
        const progressPercent = totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0;

        // 3. Membres à Risque (Ceux qui ont le plus gros "remaining")
        const atRisk = [...contributions]
            .filter(c => c.remaining > 0)
            .sort((a, b) => b.remaining - a.remaining)
            .slice(0, 10);

        // 4. Districts & Tribus présents cette année là
        const districts = Array.from(new Set(membersAtYear.map(m => m.districtName)));
        const tributes = Array.from(new Set(membersAtYear.map(m => m.tributeName)));

        return {
            totalMembers: membersAtYear.length,
            totalPaid,
            totalRemaining,
            progressPercent,
            atRisk,
            districts,
            tributes,
            searchResults: allMembers.filter(m => 
                `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 4)
        };
    }, [allMembers, contributions, selectedYear, searchTerm]);

    return (
        <div className="p-4 md:p-10 bg-white min-h-screen pb-24 font-sans text-slate-700">
            
            {/* HEADER AVEC SÉLECTEUR D'ANNÉE */}
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight">
                        Tableau de bord <span className="text-slate-300 font-light">{selectedYear}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Changer d'année :</span>
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-slate-100 border-2 border-slate-200 rounded-xl px-3 py-1 font-bold text-brand-primary outline-none focus:border-brand-primary transition-all cursor-pointer"
                        >
                            {[...Array(5)].map((_, i) => (
                                <option key={i} value={new Date().getFullYear() + 1 - i}>
                                    {new Date().getFullYear() + 1 - i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative w-full max-w-md group">
                    <input 
                        type="text"
                        placeholder="Chercher un membre..."
                        className="w-full px-6 py-4 bg-slate-100 border-2 border-slate-200 rounded-2xl font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-[0_4px_0_0_#e2e8f0]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-10">
                
                {/* CARTES PRINCIPALES */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* CERCLE DE PROGRESSION SEXY */}
                    <div className="relative bg-white border-2 border-slate-200 p-6 rounded-[2.5rem] shadow-[0_6px_0_0_#f1f5f9] flex flex-col items-center justify-center text-center">
                        <div className="relative w-24 h-24 mb-4">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-brand-primary" strokeWidth="4" 
                                    strokeDasharray={`${stats.progressPercent}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-black text-brand-primary">
                                {Math.round(stats.progressPercent)}%
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Objectif Payé</p>
                    </div>

                    <div className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] shadow-[0_6px_0_0_#f1f5f9]">
                        <p className="text-3xl font-black text-slate-800">{stats.totalMembers}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider italic">Inscrits en {selectedYear}</p>
                    </div>

                    <div className="bg-brand-primary p-8 rounded-[2.5rem] shadow-[0_6px_0_0_#b91c1c] text-white">
                        <p className="text-2xl font-black">{stats.totalPaid.toLocaleString()} Ar</p>
                        <p className="text-[10px] font-black uppercase opacity-80 italic">Encaissé</p>
                    </div>

                    <div className="bg-white border-2 border-orange-100 p-8 rounded-[2.5rem] shadow-[0_6px_0_0_#fff7ed]">
                        <p className="text-2xl font-black text-orange-600">{stats.totalRemaining.toLocaleString()} Ar</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Reste à percevoir</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LISTE DES MEMBRES À RISQUE (RECETTE) */}
                    <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-[3rem] p-8 shadow-[0_8px_0_0_#f8fafc]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight italic">
                                <AiOutlineWarning className="text-orange-500" /> Membres à risque ({selectedYear})
                            </h3>
                            <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full">TOP 10 RETARDS</span>
                        </div>
                        
                        <div className="space-y-3">
                            {stats.atRisk.length > 0 ? stats.atRisk.map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-brand-primary border-2 border-slate-100">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm uppercase">{c.memberName}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase italic">Dû : {c.amount.toLocaleString()} Ar</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-red-600">-{c.remaining.toLocaleString()} Ar</p>
                                        <p className="text-[8px] font-black text-slate-300 uppercase italic">Relancer au plus vite</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <AiOutlineCheckCircle size={40} className="mx-auto text-emerald-400 mb-2" />
                                    <p className="text-slate-400 font-bold italic text-sm">Bravo ! Aucun impayé pour cette année.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS & NAVIGATION */}
                    <div className="lg:col-span-5 space-y-4">
                        <button onClick={() => navigate('/members')} className="w-full bg-white border-2 border-slate-200 p-6 rounded-3xl flex items-center justify-between font-black text-slate-700 shadow-[0_4px_0_0_#e2e8f0] hover:translate-y-1 hover:shadow-none transition-all group">
                            <span className="italic uppercase">Base de données membres</span>
                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"><AiOutlineArrowRight /></div>
                        </button>

                        <button onClick={() => setShowGeoModal(true)} className="w-full bg-white border-2 border-slate-200 p-6 rounded-3xl flex items-center justify-between font-black text-slate-700 shadow-[0_4px_0_0_#e2e8f0] hover:translate-y-1 hover:shadow-none transition-all group text-left">
                            <div>
                                <span className="italic uppercase block">Secteurs & Origines</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stats.districts.length} Districts / {stats.tributes.length} Tribus</span>
                            </div>
                            <div className="p-2 bg-brand-bg text-brand-primary rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors"><AiOutlineGlobal size={20}/></div>
                        </button>

                        {/* LE GRAPHE (Miniature cliquable) */}
                        <div className="bg-brand-text p-8 rounded-[2.5rem] text-white shadow-[0_8px_0_0_#000] space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                <AiOutlineCalendar className="text-brand-primary" /> Flux mensuel {selectedYear}
                            </h4>
                            <div className="h-24 flex items-end gap-2">
                                {[30, 70, 45, 90, 65, 85, 40].map((h, i) => (
                                    <div key={i} className="flex-1 bg-white/10 rounded-t-lg relative group">
                                        <div className="absolute bottom-0 w-full bg-brand-primary rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/cotisations')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                Gérer les paiements futurs
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL GÉO (Idem précédent mais filtré par année) */}
            {showGeoModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 border-2 border-slate-200 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8 border-b-2 border-slate-50 pb-4">
                            <h2 className="text-xl font-black text-slate-800 uppercase italic">Répertoire {selectedYear}</h2>
                            <button onClick={() => setShowGeoModal(false)} className="text-slate-400 hover:text-red-500 font-black text-xs">FERMER ×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[9px] font-black text-brand-primary uppercase mb-4 tracking-widest italic">Districts</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {stats.districts.map(d => <div key={d} className="p-3 bg-slate-50 rounded-xl text-[10px] font-bold border border-slate-100 uppercase italic">{d}</div>)}
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest italic">Tribus</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {stats.tributes.map(t => <div key={t} className="p-3 bg-slate-50 rounded-xl text-[10px] font-bold border border-slate-100 uppercase italic">{t}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;