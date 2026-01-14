import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});


export const MemberCreateSchema = z.object({
    firstName: z.string().min(2, "Prénom trop court"),
    lastName: z.string().min(2, "Nom trop court"),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD requis"),
    gender: z.enum(["MALE", "FEMALE"]),
    phoneNumber: z.string().length(13, "Le numéro doit faire 13 caractères (ex: +261...)"),
    districtId: z.number().positive(),
    tributeId: z.number().positive(),
    status: z.enum(["WORKER", "STUDENT"]),
    imageUrl: z.string().min(1, "L'identifiant de l'image est requis"), 
});

export const RegisterAdminSchema = z.object({
    firstName: z.string().min(2, "Prénom trop court"),
    lastName: z.string().min(2, "Nom trop court"),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD requis"),
    gender: z.enum(["MALE", "FEMALE"]),
    imageUrl: z.string().min(1, "L'identifiant de l'image est requis"),
    phoneNumber: z.string().min(10, "Numéro invalide"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});