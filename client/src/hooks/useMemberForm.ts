import { useState, useEffect, useCallback } from "react";
import { memberService } from "../services/memberService";
import { toast } from "react-hot-toast";
import type { MemberResponse, MemberCreateRequest } from "../utils/types/models/Member.types";
import type { Gender, MemberStatus } from "../utils/types/models/Common.types";

interface FormErrors {
  [key: string]: string;
}

export const useMemberForm = (onSuccess: () => void, initialData?: MemberResponse | null) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<MemberCreateRequest>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    gender: "MALE" as Gender,
    status: "STUDENT" as MemberStatus,
    imageUrl: "",
    districtId: 0,
    tributeId: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        phoneNumber: initialData.phoneNumber || "",
        birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : "",
        gender: initialData.gender,
        status: initialData.status,
        imageUrl: initialData.imageUrl || "",
        districtId: initialData.districtId,
        tributeId: initialData.tributeId
      });
    }
  }, [initialData]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const finalValue = (name === "districtId" || name === "tributeId") 
      ? (parseInt(value, 10) || 0) 
      : value;
    setFormData((prev: MemberCreateRequest) => ({ 
        ...prev, 
        [name]: finalValue 
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (formData.districtId === 0) newErrors.districtId = "Sélectionnez un district";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (initialData?.id) {
        await memberService.update(initialData.id, formData);
        toast.success("Mis à jour !");
      } else {
        await memberService.createWithDependencies(formData);
        toast.success("Créé !");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };
  return { formData, handleChange, handleSubmit, loading, errors, setFormData };
};