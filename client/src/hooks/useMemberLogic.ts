import { useState, useMemo, useEffect, useCallback } from "react";
import type { Member } from "../utils/types/types";
import { memberService } from "../services/memberService";
import { GITHUB_BASE_URL, DEFAULT_AVATAR } from "../utils/constants/constants";

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

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await memberService.getAll();
      const formattedData = data.map((m: Member) => ({
        ...m,
        imageUrl: m.imageUrl 
          ? (m.imageUrl.startsWith('http') ? m.imageUrl : `${GITHUB_BASE_URL}${m.imageUrl}`)
          : DEFAULT_AVATAR
      }));
      setMembers(formattedData);
    } catch (err) {
      console.error("Erreur de synchronisation.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = !search || `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase());
      const matchesSex = !filterSex || m.gender === filterSex;
      const matchesDistrict = !filterDistrict || m.district?.name === filterDistrict;
      const matchesTribe = !filterTribe || m.tribute?.name === filterTribe;
      const matchesCotisation = !filterCotisation || m.cotisationStatus === filterCotisation;

      return matchesSearch && matchesSex && matchesDistrict && matchesTribe && matchesCotisation;
    });
  }, [members, search, filterSex, filterDistrict, filterTribe, filterCotisation]);

  return {
    members: filteredMembers, loading, search, setSearch,
    filterSex, setFilterSex, filterDistrict, setFilterDistrict,
    filterTribe, setFilterTribe, filterCotisation, setFilterCotisation,
    selectedMembers,
    handleSelect: (id: string) => setSelectedMembers(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]),
    handleSelectAll: (check: boolean) => setSelectedMembers(check ? filteredMembers.map(m => String(m.id)) : []),
    deleteAction: async (ids: string[]) => {
      await Promise.all(ids.map(id => memberService.delete(id)));
      setMembers(p => p.filter(m => !ids.includes(String(m.id))));
      setSelectedMembers([]);
    },
    fullResetAction: async () => {
      const success = await memberService.clearAllData();
      if (success) { setMembers([]); setSelectedMembers([]); }
      return success;
    },
    refreshMembers: fetchMembers
  };
};