import { useState, useEffect } from 'react';
import { PersonDto, PersonResponseDto } from '../lib/types/models/person.type';
import { PersonService } from '../services/person.services';
import { personSchema } from '../lib/schemas/person.schema';
import toast from 'react-hot-toast';

export const useMemberForm = (onSuccess: () => void, memberToEdit?: PersonResponseDto | null) => {
    const initialState: PersonDto = {
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "MALE",
        imageUrl: "",
        phoneNumber: "",
        status: "STUDENT",
        districtId: 0,
        tributeId: 0,
        parentId: undefined 
    };

    const [formData, setFormData] = useState<PersonDto>(initialState);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (memberToEdit) {
            setFormData({
                firstName: memberToEdit.firstName,
                lastName: memberToEdit.lastName,
                birthDate: memberToEdit.birthDate ? String(memberToEdit.birthDate).split('T')[0] : "",
                gender: memberToEdit.gender,
                imageUrl: memberToEdit.imageUrl || "",
                phoneNumber: memberToEdit.phoneNumber,
                status: memberToEdit.status,
                districtId: memberToEdit.districtId,
                tributeId: memberToEdit.tributeId,
                parentId: memberToEdit.parentId || undefined
            });
        } else {
            setFormData(initialState);
        }
    }, [memberToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'districtId' || name === 'tributeId') ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // --- ÉTAPE 1: DÉBOGAGE ---
        console.log("Tentative de soumission avec:", formData);
        setErrors({});

        // --- ÉTAPE 2: PRÉPARATION DU PAYLOAD (Format Java) ---
        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            birthDate: formData.birthDate,
            gender: formData.gender,
            imageUrl: formData.imageUrl.trim() || "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
            phoneNumber: formData.phoneNumber.trim(),
            status: formData.status,
            districtId: Number(formData.districtId),
            tributeId: Number(formData.tributeId),
            parentId: (formData.parentId && formData.parentId.trim() !== "") ? formData.parentId : null
        };

        const validation = personSchema.safeParse(payload);
        
        if (!validation.success) {
            console.error("Échec de validation Zod:", validation.error.format());
            
            const fieldErrors = validation.error.flatten().fieldErrors;
            const formattedErrors: Record<string, string> = {};
            
            Object.keys(fieldErrors).forEach((key) => {
                const messages = fieldErrors[key as keyof typeof fieldErrors];
                if (messages && messages.length > 0) formattedErrors[key] = messages[0];
            });
            
            setErrors(formattedErrors);
            toast.error("Veuillez remplir correctement tous les champs.");
            return;
        }
        if (payload.districtId === 0 || payload.tributeId === 0) {
            toast.error("Sélectionnez un district et une tribu.");
            return;
        }

        setLoading(true);
        console.log("Validation réussie. Envoi de la requête au serveur...");

        try {
            if (memberToEdit) {
                toast.error("Édition non supportée");
            } else {
                const response = await PersonService.create(payload as any);
                console.log("Réponse succès:", response);
                toast.success("Membre créé avec succès !");
                onSuccess();
            }
        } catch (error: any) {
            console.error("Erreur Network/API:", error);
            const serverMessage = error.response?.data?.message || "";
            
            if (serverMessage.includes("contributions") || serverMessage.includes("23503")) {
                toast.error("Membre créé, mais erreur de cotisation automatique.");
                onSuccess(); 
            } else {
                toast.error(serverMessage || "Erreur de connexion au serveur");
            }
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, loading, errors, setFormData };
};