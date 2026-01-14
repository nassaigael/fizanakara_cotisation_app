import { useState, useEffect, useMemo, useCallback } from 'react';
import { memberService } from '../services/memberService';

// On récupère les tarifs depuis tes constantes ou on les définit ici
const TARIFS_COTISATION: Record<string, number> = {
  'TRAVAILLEUR': 50000,
  'ETUDIANT': 25000,
  'ENFANT': 10000,
  'AUTRE': 30000
};

export const useDashboardLogic = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await memberService.getAll();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur Dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const yearNum = parseInt(selectedYear);
    let totalPerçu = 0;
    let totalTheoriqueAAttendre = 0;
    let fluxMensuels = Array(12).fill(0);
    let registreGlobal: any[] = [];

    members.forEach(m => {
      // 1. Calcul de l'objectif basé sur le statut
      const statutMembre = (m.status || 'AUTRE').toUpperCase();
      const montantDu = TARIFS_COTISATION[statutMembre] || TARIFS_COTISATION['AUTRE'];
      totalTheoriqueAAttendre += montantDu;

      // 2. Traitement des paiements de l'année
      const yearPayments = m.payments?.filter((p: any) => p.year === yearNum) || [];
      
      yearPayments.forEach((p: any) => {
        totalPerçu += p.amount;
        
        const dateObj = new Date(p.date);
        if (!isNaN(dateObj.getTime())) {
          fluxMensuels[dateObj.getMonth()] += p.amount;
        }

        registreGlobal.push({
          id: p.id || Math.random(),
          membre: `${m.firstName} ${m.lastName}`,
          montant: p.amount,
          date: p.date,
          label: `Cotisation ${statutMembre.toLowerCase()}`
        });
      });
    });

    return {
      totalTheoriqueAAttendre,
      totalPerçu,
      totalImpayé: Math.max(0, totalTheoriqueAAttendre - totalPerçu),
      tauxRecouvrement: totalTheoriqueAAttendre > 0 ? Math.round((totalPerçu / totalTheoriqueAAttendre) * 100) : 0,
      fluxMensuels,
      journal: registreGlobal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
    };
  }, [members, selectedYear]);

  return { selectedYear, setSelectedYear, loading, stats, membersCount: members.length };
};