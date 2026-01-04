import { useState, useEffect, useMemo, useCallback } from "react";
import { memberService } from "../services/memberService";
import { toast } from "react-hot-toast";
import type { Member } from "../utils/types/types";
import { getFinancials } from "../utils/FinanceHelper";

export const useMemberLogic = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    const [search, setSearch] = useState("");
    const [filterSex, setFilterSex] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("");
    const [filterTribe, setFilterTribe] = useState("");
    const [filterCotisation, setFilterCotisation] = useState("");
    const refreshMembers = useCallback(async () => {
        try {
            const data = await memberService.getAll();
            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erreur sync:", err);
            toast.error("Échec de la synchronisation");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        refreshMembers(); 
    }, [refreshMembers]);

    const filteredMembers = useMemo(() => {
        return members.filter(m => {
            const matchSearch = !search || 
                `${m.firstName} ${m.lastName} ${m.phoneNumber}`
                .toLowerCase().includes(search.toLowerCase());
            const matchSex = !filterSex || m.gender === filterSex;
            const currentDistrict = m.districtName || m.district?.name;
            const matchDistrict = !filterDistrict || currentDistrict === filterDistrict;
            const currentTribe = m.tributeName || m.tribute?.name;
            const matchTribe = !filterTribe || currentTribe === filterTribe;
            const { reste } = getFinancials(m);
            const isPaye = reste <= 0;
            const matchCotisation = !filterCotisation || 
                (filterCotisation === "Payé" ? isPaye : !isPaye);

            return matchSearch && matchSex && matchDistrict && matchTribe && matchCotisation;
        });
    }, [members, search, filterSex, filterDistrict, filterTribe, filterCotisation]);
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
            await refreshMembers(); 
            setSelectedMembers([]);
        } catch (err) {
            toast.error("Erreur lors de la suppression");
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
        refreshMembers
    };
};