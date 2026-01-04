import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * useLoginLogic - Gère la logique métier du formulaire d'authentification.
 * Optimisé pour réduire le nombre de re-renders via un état groupé.
 */
export const useLoginLogic = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // État groupé pour tous les champs du formulaire
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "MALE" as "MALE" | "FEMALE",
    phoneNumber: ""
  });

  // Fonction générique pour mettre à jour n'importe quel champ
  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isRegister) {
        // Préparation du payload pour le backend Java
        const payload = {
            ...formData,
            phoneNumber: formData.phoneNumber.replace(/\s/g, ''),
            imageUrl: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=FF4B4B&color=fff`
        };

        await register(payload);
        setMessage({ text: "Compte administrateur créé avec succès !", type: 'success' });
      } else {
        await login(formData.email, formData.password, rememberMe);
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Serveur indisponible ou identifiants incorrects";
      setMessage({ text: errorMessage, type: 'error' });
      console.error("Auth process error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // On adapte le retour pour que la page Login reste compatible
  return {
    isRegister, setIsRegister,
    loading, message, setMessage,
    rememberMe, setRememberMe,
    handleLogin,
    // Champs individuels extraits pour la page Login
    email: formData.email, setEmail: (val: string) => handleChange('email', val),
    password: formData.password, setPassword: (val: string) => handleChange('password', val),
    firstName: formData.firstName, setFirstName: (val: string) => handleChange('firstName', val),
    lastName: formData.lastName, setLastName: (val: string) => handleChange('lastName', val),
    birthDate: formData.birthDate, setBirthDate: (val: string) => handleChange('birthDate', val),
    gender: formData.gender, setGender: (val: "MALE" | "FEMALE") => handleChange('gender', val),
    phoneNumber: formData.phoneNumber, setPhoneNumber: (val: string) => handleChange('phoneNumber', val),
  };
};