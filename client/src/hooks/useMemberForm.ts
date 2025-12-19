import { useState, useEffect } from "react";
import { memberService } from "../services/memberService";
import type { Member } from "../utils/types/types";

export const useMemberForm = (onSuccess: () => void, initialData?: Member | null) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({
    first_name: "",
    last_name: "",
    phone_number: "",
    gender: "MALE",
    status: "Étudiant",
    birth_date: "",
    district_id: 1,
    tribute_id: 1,
    cotisationStatus: "Impayé"
  });

  // Si on reçoit des données initiales (Mode Édition), on pré-remplit le formulaire
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        first_name: "", last_name: "", phone_number: "",
        gender: "MALE", status: "Étudiant", birth_date: "",
        district_id: 1, tribute_id: 1, cotisationStatus: "Impayé"
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        // Logique UPDATE
        await memberService.update(initialData.id, formData);
      } else {
        // Logique CREATE
        await memberService.create(formData);
      }
      onSuccess();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, handleChange, handleSubmit, loading };
};