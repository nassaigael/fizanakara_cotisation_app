import { useState, useEffect, useCallback, useMemo } from 'react';
import { ContributionService } from '../services/contribution.service';
import { PaymentService } from '../services/payment.service';
import { ContributionResponseDto } from '../lib/types/models/contribution.type';
import { MemberHelper } from '../lib/helper/member.helper';
import toast from 'react-hot-toast';

export const useContribution = (year: number = new Date().getFullYear()) => {
    const [contributions, setContributions] = useState<ContributionResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchContributions = useCallback(async () => {
        setLoading(true);
        try {
            // Dans un système réel, on récupère les cotisations pour l'année
            // Si elles n'existent pas, le backend peut les générer
            const data = await ContributionService.generateForYear({ year });
            setContributions(data);
        } catch (error) {
            toast.error("Erreur de chargement des cotisations");
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => { fetchContributions(); }, [fetchContributions]);

    // Filtrage : Uniquement les adultes (> 18 ans) et recherche par nom
    const filteredData = useMemo(() => {
        return contributions.filter(c => {
            const matchesSearch = c.memberName.toLowerCase().includes(search.toLowerCase());
            // Note: Le backend devrait déjà filtrer les enfants, 
            // mais nous pouvons ajouter une sécurité ici si nécessaire.
            return matchesSearch;
        });
    }, [contributions, search]);

    const addPayment = async (contributionId: string, amount: number) => {
        try {
            await PaymentService.create({
                contributionId,
                amountPaid: amount,
                status: 'COMPLETED',
                paymentDate: new Date().toISOString()
            });
            toast.success("Paiement enregistré");
            fetchContributions(); // Recharger pour voir le nouveau solde
        } catch (error) {
            toast.error("Erreur lors du paiement");
        }
    };

    return {
        contributions: filteredData,
        loading,
        search,
        setSearch,
        addPayment,
        refresh: fetchContributions
    };
};