import { useState, useEffect, useCallback, useMemo } from 'react';
import { PersonService } from '../services/person.services';
import { PersonResponseDto } from '../lib/types/models/person.type';
import toast from 'react-hot-toast';

export const useMemberLogic = () => {
    const [members, setMembers] = useState<PersonResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    // États des filtres
    const [filterSex, setFilterSex] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("");
    const [filterTribe, setFilterTribe] = useState("");

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await PersonService.getAll();
            setMembers(data);
        } catch (error) {
            toast.error("Erreur de synchronisation");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    // Logique de filtrage
    const filteredMembers = useMemo(() => {
        return members.filter(m => {
            const matchesSearch = `${m.firstName} ${m.lastName} ${m.phoneNumber}`.toLowerCase().includes(search.toLowerCase());
            const matchesSex = filterSex ? m.gender === filterSex : true;
            const matchesDistrict = filterDistrict ? (m.districtName === filterDistrict) : true;
            const matchesTribe = filterTribe ? (m.tributeName === filterTribe) : true;
            return matchesSearch && matchesSex && matchesDistrict && matchesTribe;
        });
    }, [members, search, filterSex, filterDistrict, filterTribe]);

    // Sélection multiple
    const handleSelect = (id: string) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedMembers(checked ? filteredMembers.map(m => m.id) : []);
    };

    const deleteAction = async (ids: string[]) => {
        if (!window.confirm(`Confirmer la suppression de ${ids.length} membre(s) ?`)) return;
        try {
            await Promise.all(ids.map(id => PersonService.delete(id)));
            toast.success("Suppression réussie");
            setSelectedMembers([]);
            fetchMembers();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    return {
        members: filteredMembers,
        allMembers: members, // utile pour extraire les options de filtres
        loading, search, setSearch,
        filterSex, setFilterSex,
        filterDistrict, setFilterDistrict,
        filterTribe, setFilterTribe,
        selectedMembers, handleSelect, handleSelectAll,
        deleteAction, refreshMembers: fetchMembers
    };
};