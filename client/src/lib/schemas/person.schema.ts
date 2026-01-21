import { z } from "zod";

const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

export const personSchema = z.object({
    firstName: z.string().min(1, "Le prénom est obligatoire"),
    lastName: z.string().min(1, "Le nom est obligatoire"),
    birthDate: z.string().refine(val => {
        const age = calculateAge(val);
        return age >= 0; 
    }, "Date de naissance invalide"),
    parentId: z.string().nullable().optional(), 
    gender: z.enum(["MALE", "FEMALE"]),
    imageUrl: z.string().min(1, "L'URL de l'image est requise"),
    phoneNumber: z.string().min(1, "Le numéro de téléphone est obligatoire"),
    status: z.string().min(1, "Le statut est requis"),
    districtId: z.number().gt(0, "Veuillez sélectionner un District"),
    tributeId: z.number().gt(0, "Veuillez sélectionner un Tribut"),
});

export const paymentSchema = z.object({
    amountPaid: z.number().positive("Le montant doit être supérieur à 0"),
    contributionId: z.string().min(1, "ID de cotisation manquant"),
});