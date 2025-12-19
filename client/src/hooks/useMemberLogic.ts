import { useState, useMemo, useEffect } from "react";
import type { Member } from "../utils/types/types";
import { memberService } from "../services/memberService";

export const useMemberLogic = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const [search, setSearch] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterTribe, setFilterTribe] = useState(""); 
  const [filterCotisation, setFilterCotisation] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const data = await memberService.getAll();
        setMembers(data || []); // Si pas de données, tableau vide (zéro membre)
      } catch (err: any) {
        console.error("Erreur de récupération des membres:", err);
        setError("Impossible de charger les membres. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Filtrage sécurisé (au cas où des champs seraient null en DB)
      const firstName = m.first_name || "";
      const lastName = m.last_name || "";
      const phone = m.phone_number || "";
      
      const searchStr = `${firstName} ${lastName} ${phone}`.toLowerCase();
      const matchesSearch = searchStr.includes(search.toLowerCase());
      const matchesSex = filterSex ? m.gender === filterSex : true;
      const matchesCotisation = filterCotisation ? m.cotisationStatus === filterCotisation : true;
      const matchesTribe = filterTribe ? String(m.tribute_id) === filterTribe : true;

      return matchesSearch && matchesSex && matchesCotisation && matchesTribe;
    });
  }, [members, search, filterSex, filterTribe, filterCotisation]);

  // Fonctions de sélection
  const handleSelect = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedMembers(isChecked ? filteredMembers.map(m => m.id) : []);
  };

  // Action de suppression réelle
  const deleteAction = async (ids: string[]) => {
    try {
        // Optionnel : Activer l'appel API si ton backend supporte le delete-batch
        // await memberService.deleteMultiple(ids);
        
        // Mise à jour optimiste de l'UI
        setMembers(prev => prev.filter(m => !ids.includes(m.id)));
        setSelectedMembers([]);
    } catch (err) {
        alert("Erreur lors de la suppression sur le serveur");
    }
  };

  return {
    members: filteredMembers,
    loading,
    error,
    search, setSearch,
    filterSex, setFilterSex,
    filterTribe, setFilterTribe,
    filterCotisation, setFilterCotisation,
    selectedMembers, handleSelect, handleSelectAll,
    deleteAction
  };
};