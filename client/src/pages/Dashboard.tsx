import React, { useState, useEffect, useMemo } from 'react';
import { 
  AiOutlineTeam, AiOutlineDollarCircle, AiOutlineCheckCircle, 
  AiOutlineWarning, AiOutlineHistory, AiOutlineArrowRight 
} from 'react-icons/ai';
import { memberService } from '../services/memberService';
import { StatCard3D } from '../components/dashboard/StatCard3D';
import { THEME } from '../styles/theme';

const Dashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const COTISATION_ANNUELLE = 50000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await memberService.getAll();
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur de récupération des données:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CALCULS DU BILAN GLOBAL (LOGIQUE OPTIMISÉE) ---
  const globalStats = useMemo(() => {
    const yearNum = parseInt(selectedYear);
    
    let totalPerçu = 0;
    let membresConcernes = 0;
    let fluxMensuels = Array(12).fill(0);
    let registreGlobal: any[] = [];

    members.forEach(m => {
      const payments = m.payments?.filter((p: any) => p.year === yearNum) || [];
      
      // On calcule l'objectif uniquement pour ceux qui ont commencé à cotiser
      if (payments.length > 0) {
        membresConcernes++;
        
        payments.forEach((p: any) => {
          totalPerçu += p.amount;
          const dateObj = new Date(p.date);
          if (!isNaN(dateObj.getTime())) {
            fluxMensuels[dateObj.getMonth()] += p.amount;
          }

          registreGlobal.push({
            id: p.id || `p-${Math.random()}`,
            membre: `${m.firstName} ${m.lastName}`,
            montant: p.amount,
            date: p.date,
            label: p.status || "Cotisation"
          });
        });
      }
    });

    const totalTheoriqueAAttendre = membresConcernes * COTISATION_ANNUELLE;
    const totalImpayé = Math.max(0, totalTheoriqueAAttendre - totalPerçu);
    const tauxRecouvrement = totalTheoriqueAAttendre > 0 
      ? Math.round((totalPerçu / totalTheoriqueAAttendre) * 100) 
      : 0;

    return {
      totalTheoriqueAAttendre,
      totalPerçu,
      totalImpayé,
      tauxRecouvrement,
      fluxMensuels,
      journal: registreGlobal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
    };
  }, [members, selectedYear]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      <p className={`${THEME.font.black} text-brand-muted text-[10px] uppercase tracking-widest`}>Lecture de la caisse...</p>
    </div>
  );

  return (
    <div className="p-2 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl ${THEME.font.black} text-brand-text uppercase tracking-tighter`}>Bilan des Cotisations</h1>
          <p className="text-brand-muted font-bold text-[10px] uppercase tracking-widest opacity-60">
            Objectif {selectedYear} : {globalStats.totalTheoriqueAAttendre.toLocaleString()} Ar
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border-2 border-brand-border shadow-sm">
          <AiOutlineHistory className="ml-2 text-brand-muted" size={18} />
          {["2025", "2024", "2023"].map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-5 py-2 rounded-xl ${THEME.font.black} text-[10px] uppercase transition-all ${
                selectedYear === yr 
                ? 'bg-brand-primary text-white border-b-4 border-brand-primary-dark shadow-md scale-105' 
                : 'text-brand-muted hover:bg-brand-bg'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard3D title="Contributeurs" value={members.length} subValue="Membres inscrits" icon={AiOutlineTeam} color="blue" />
        <StatCard3D title="Caisse Réelle" value={`${globalStats.totalPerçu.toLocaleString()} Ar`} subValue="Perçu total" icon={AiOutlineDollarCircle} color="green" />
        <StatCard3D title="Impayés" value={`${globalStats.totalImpayé.toLocaleString()} Ar`} subValue="Reste à recouvrer" icon={AiOutlineWarning} color="yellow" />
        <StatCard3D title="Recouvrement" value={`${globalStats.tauxRecouvrement}%`} subValue="Performance" icon={AiOutlineCheckCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRAPHIQUE DES FLUX */}
        <div className="lg:col-span-2 bg-white border-2 border-b-8 border-brand-border rounded-[2.5rem] p-8">
          <h2 className={`text-lg ${THEME.font.black} text-brand-text mb-10 uppercase`}>Flux mensuels {selectedYear}</h2>
          <div className="h-64 flex items-end justify-between gap-2 border-b-2 border-brand-bg pb-2">
            {globalStats.fluxMensuels.map((v, i) => {
              const max = Math.max(...globalStats.fluxMensuels);
              const height = max > 0 ? (v / max) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div style={{ height: `${height}%` }} className="w-full bg-brand-primary/20 group-hover:bg-brand-primary rounded-t-lg border-b-4 border-brand-primary-dark transition-all min-h-1"></div>
                  <span className="text-[8px] font-bold text-brand-muted uppercase">
                    {new Date(0, i).toLocaleString('fr', {month: 'short'}).replace('.', '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* JOURNAL DES DERNIERS PAIEMENTS */}
        <div className="bg-brand-bg border-2 border-brand-border rounded-[3rem] p-6 shadow-inner">
          <h2 className={`text-sm ${THEME.font.black} text-brand-text mb-6 uppercase flex items-center gap-2`}>
            <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
            Dernières Entrées
          </h2>
          <div className="space-y-3">
            {globalStats.journal.length > 0 ? globalStats.journal.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-b-4 border-brand-border flex justify-between items-center transform hover:-translate-y-1 transition-all">
                <div className="max-w-[120px]">
                  <p className="font-black text-[10px] text-brand-text uppercase truncate leading-none">{item.membre}</p>
                  <p className="text-[8px] font-bold text-brand-muted mt-1 uppercase">{item.label}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-black text-[10px] text-green-600">+{item.montant.toLocaleString()} Ar</p>
                  <p className="text-[7px] font-black text-gray-400 italic">{new Date(item.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <AiOutlineHistory size={32} className="text-brand-muted mb-2" />
                <p className="text-[9px] font-black text-brand-muted uppercase">Aucun flux</p>
              </div>
            )}
          </div>
          <button className={`w-full mt-6 py-4 bg-white border-2 border-b-4 border-brand-border rounded-2xl text-[10px] ${THEME.font.black} text-brand-muted uppercase hover:text-brand-primary transition-all flex items-center justify-center gap-2`}>
            Journal Complet <AiOutlineArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;