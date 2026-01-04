import { useState, useEffect } from "react";
import { memberService } from "../services/memberService";
import { toast } from "react-hot-toast"; // Utilisons toast au lieu d'alert
import type { Member, Gender } from "../utils/types/types";

export const useMemberForm = (onSuccess: () => void, initialData?: Member | null) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phoneNumber: "", email: "",
    birthDate: "", gender: "MALE" as Gender, status: "Etudiant", 
    imageUrl: "", districtName: "", tributeName: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        phoneNumber: initialData.phoneNumber || "",
        email: initialData.email || "",
        birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : "",
        gender: initialData.gender || "MALE",
        status: (initialData.status as any) || "Etudiant",
        imageUrl: initialData.imageUrl || "",
        districtName: initialData.district?.name || "",
        tributeName: initialData.tribute?.name || ""
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
        await memberService.update(initialData.id, formData);
        toast.success("Membre mis à jour");
      } else {
        await memberService.createWithDependencies(formData);
        toast.success("Membre créé avec succès");
      }
      onSuccess();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, handleChange, handleSubmit, loading };
};