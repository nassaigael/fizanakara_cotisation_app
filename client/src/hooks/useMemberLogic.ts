import { useState, useEffect, useMemo, useCallback } from "react";
import { memberService } from "../services/memberService";
import { toast } from "react-hot-toast";
import type { Member } from "../utils/types/types";

export const useMemberLogic = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    // États des filtres
    const [search, setSearch] = useState("");
    const [filterSex, setFilterSex] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("");
    const [filterTribe, setFilterTribe] = useState("");
    const [filterCotisation, setFilterCotisation] = useState("");

    // --- SYNCHRONISATION ---
    const refreshMembers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await memberService.getAll();
            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erreur sync:", err);
            toast.error("Échec de la synchronisation avec le serveur");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refreshMembers(); }, [refreshMembers]);

    // --- LOGIQUE DE FILTRAGE (Mémoïsée) ---
    const filteredMembers = useMemo(() => {
        return members.filter(m => {
            const matchSearch = !search || 
                `${m.firstName} ${m.lastName} ${m.phoneNumber}`
                .toLowerCase().includes(search.toLowerCase());
            
            const matchSex = !filterSex || m.gender === filterSex;
            const matchDistrict = !filterDistrict || m.district?.name === filterDistrict;
            const matchTribe = !filterTribe || m.tribute?.name === filterTribe;
            const matchCotisation = !filterCotisation || m.cotisationStatus === filterCotisation;

            return matchSearch && matchSex && matchDistrict && matchTribe && matchCotisation;
        });
    }, [members, search, filterSex, filterDistrict, filterTribe, filterCotisation]);

    // --- ACTIONS ---
    const handleSelect = (id: string) => {
        setSelectedMembers(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedMembers(checked ? filteredMembers.map(m => String(m.id)) : []);
    };

    const deleteAction = async (ids: string[]) => {
        try {
            await Promise.all(ids.map(id => memberService.delete(id)));
            toast.success(ids.length > 1 ? "Membres supprimés" : "Membre supprimé");
            refreshMembers(); // Rechargement propre
            setSelectedMembers([]);
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const fullResetAction = async () => {
        try {
            const success = await memberService.clearAllData();
            if (success) {
                toast.success("Base de données réinitialisée");
                setMembers([]);
                setSelectedMembers([]);
            }
        } catch (err) {
            toast.error("Erreur lors du reset");
        }
    };

    return {
        members: filteredMembers,
        loading,
        search, setSearch,
        filterSex, setFilterSex,
        filterDistrict, setFilterDistrict,
        filterTribe, setFilterTribe,
        filterCotisation, setFilterCotisation,
        selectedMembers,
        handleSelect,
        handleSelectAll,
        deleteAction,
        fullResetAction,
        refreshMembers
    };
};