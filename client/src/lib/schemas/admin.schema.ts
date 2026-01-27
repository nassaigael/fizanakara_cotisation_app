import { z } from "zod";

const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

export const adminBaseSchema = z.object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    birthDate: z.string().refine((date) => {
        const age = calculateAge(date);
        return age >= 18;
    }, "Un administrateur doit être majeur (>= 18 ans)"),    gender: z.enum(["MALE", "FEMALE"]),
    imageUrl: z.string(),
    phoneNumber: z.string().min(10, "Numéro de téléphone trop court"),
    email: z.string().email("Email invalide"),
});

export const loginSchema = z.object({
    email: z.string().email("Email requis"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export const registerSchema = adminBaseSchema.extend({
    password: z.string().min(6, "Mot de passe trop court"),
});