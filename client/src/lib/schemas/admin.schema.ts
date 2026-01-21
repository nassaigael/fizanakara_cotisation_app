import { z } from "zod";

export const adminBaseSchema = z.object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Date invalide"),
    gender: z.enum(["MALE", "FEMALE"]),
    imageUrl: z.string().url("URL de l'image invalide"),
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