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
                birthDate: memberToEdit.birthDate ? memberToEdit.birthDate.split('T')[0] : "",
                gender: memberToEdit.gender,
                imageUrl: memberToEdit.imageUrl,
                phoneNumber: memberToEdit.phoneNumber,
                status: memberToEdit.status,
                districtId: memberToEdit.districtId,
                tributeId: memberToEdit.tributeId,
                parentId: memberToEdit.parentId
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
        e.preventDefault();
        setErrors({});
        
        const validation = personSchema.safeParse(formData);
        
        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const formattedErrors: Record<string, string> = {};

            // Correction de l'erreur d'indexation (Type casting)
            Object.keys(fieldErrors).forEach((key) => {
                const messages = fieldErrors[key as keyof typeof fieldErrors];
                if (messages && messages.length > 0) {
                    formattedErrors[key] = messages[0];
                }
            });

            setErrors(formattedErrors);
            return;
        }

        setLoading(true);
        try {
            if (memberToEdit) {
                toast.error("Édition non implémentée");
            } else {
                await PersonService.create(formData);
                toast.success("Membre enregistré avec succès !");
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, loading, errors };
};