import React from 'react';
import { 
  AiOutlineTeam, AiOutlineDollarCircle, AiOutlineCheckCircle, 
  AiOutlineWarning
} from 'react-icons/ai';
import { StatCard3D } from '../components/dashboard/StatCard3D';
import { THEME } from '../styles/theme';
import { useDashboardLogic } from '../hooks/useDashbord';

const Dashboard: React.FC = () => {
  const { selectedYear, setSelectedYear, loading, stats, membersCount } = useDashboardLogic();

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      <p className={`${THEME.font.black} text-brand-muted text-[10px] uppercase tracking-widest animate-pulse`}>
        Analyse financière en cours...
      </p>
    </div>
  );

  return (
    <div className="p-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER AVEC SÉLECTEUR D'ANNÉE */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl ${THEME.font.black} text-brand-text uppercase tracking-tighter`}>Tableau de Bord</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-brand-muted font-bold text-[10px] uppercase tracking-widest opacity-70">
               Objectif Statutaire : {stats.totalTheoriqueAAttendre.toLocaleString()} Ar
            </p>
          </div>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border-2 border-brand-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          {["2026", "2025", "2024"].map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-6 py-2.5 rounded-xl ${THEME.font.black} text-[10px] uppercase transition-all ${
                selectedYear === yr 
                ? 'bg-brand-primary text-white border-b-4 border-brand-primary-dark shadow-lg -translate-y-1' 
                : 'text-brand-muted hover:bg-brand-bg hover:text-brand-text'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </header>

      {/* CARTES DE STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard3D title="Effectif" value={membersCount} subValue="Membres actifs" icon={AiOutlineTeam} color="blue" />
        <StatCard3D title="En Caisse" value={`${stats.totalPerçu.toLocaleString()} Ar`} subValue={`Année ${selectedYear}`} icon={AiOutlineDollarCircle} color="green" />
        <StatCard3D title="Restant" value={`${stats.totalImpayé.toLocaleString()} Ar`} subValue="À recouvrer" icon={AiOutlineWarning} color="yellow" />
        <StatCard3D title="Recouvrement" value={`${stats.tauxRecouvrement}%`} subValue="Indice de succès" icon={AiOutlineCheckCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRAPHIQUE DE FLUX */}
        <div className="lg:col-span-2 bg-white border-2 border-b-12 border-brand-border rounded-[2.5rem] p-8 shadow-xl">
            <h2 className={`text-xl ${THEME.font.black} text-brand-text mb-12 uppercase tracking-tight`}>Flux de trésorerie mensuel</h2>
            <div className="h-72 flex items-end justify-between gap-3 border-b-2 border-brand-bg pb-4 relative">
                {stats.fluxMensuels.map((v, i) => {
                  const max = Math.max(...stats.fluxMensuels);
                  const height = max > 0 ? (v / max) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-text text-white text-[8px] px-2 py-1 rounded mb-1 font-bold">
                          {v.toLocaleString()}
                        </div>
                        <div 
                          style={{ height: `${height}%` }} 
                          className="w-full bg-brand-primary/10 group-hover:bg-brand-primary rounded-t-xl border-b-4 border-brand-primary-dark transition-all duration-500 ease-out min-h-1"
                        ></div>
                        <span className="text-[9px] font-black text-brand-muted uppercase group-hover:text-brand-primary transition-colors">
                            {new Date(0, i).toLocaleString('fr', {month: 'short'}).replace('.', '')}
                        </span>
                    </div>
                  );
                })}
            </div>
        </div>

        {/* JOURNAL DES ACTIVITÉS */}
        <div className="bg-brand-bg border-2 border-brand-border rounded-[3rem] p-6 shadow-inner">
          <h2 className={`text-sm ${THEME.font.black} text-brand-text mb-8 uppercase flex items-center gap-3`}>
            <span className="flex h-3 w-3 rounded-full bg-brand-primary"></span>
            Journal des encaissements
          </h2>
          <div className="space-y-4">
            {stats.journal.length > 0 ? stats.journal.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-b-4 border-brand-border hover:translate-x-1 transition-transform cursor-default">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-[11px] text-brand-text uppercase truncate w-32">{item.membre}</p>
                    <p className="text-[8px] font-bold text-brand-muted mt-1 uppercase tracking-tighter bg-brand-bg px-2 py-0.5 rounded-full inline-block">
                      {item.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[11px] text-green-600">+{item.montant.toLocaleString()}</p>
                    <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase">
                      {new Date(item.date).toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'})}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 opacity-20 grayscale">
                <AiOutlineDollarCircle size={40} className="mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase">Aucune donnée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;