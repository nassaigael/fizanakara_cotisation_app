import { useState, useMemo, useEffect } from "react";
import type { Member } from "../utils/types/memberType";
import { memberService } from "../services/memberService";

export const useMemberLogic = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // Changé en string[]
  
  const [search, setSearch] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterTribe, setFilterTribe] = useState("");
  const [filterCotisation, setFilterCotisation] = useState(""); // Ajouté

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await memberService.getAll();
        setMembers(data);
      } catch (err) {
        console.error("Erreur API", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      (`${m.firstName} ${m.lastName} ${m.quartier}`).toLowerCase().includes(search.toLowerCase()) &&
      (filterSex ? m.gender === filterSex : true) &&
      (filterTribe ? m.tribe === filterTribe : true) &&
      (filterCotisation ? m.cotisationStatus === filterCotisation : true)
    );
  }, [members, search, filterSex, filterTribe, filterCotisation]);

  const handleSelect = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedMembers(isChecked ? filteredMembers.map(m => m.id) : []);
  };

  const deleteAction = async (ids: string[]) => {
    setMembers(prev => prev.filter(m => !ids.includes(m.id)));
    setSelectedMembers([]);
  };

  return {
    members: filteredMembers,
    loading,
    search, setSearch,
    filterSex, setFilterSex,
    filterTribe, setFilterTribe,
    filterCotisation, setFilterCotisation, // Renvoie bien ces propriétés
    selectedMembers, handleSelect, handleSelectAll,
    deleteAction
  };
};