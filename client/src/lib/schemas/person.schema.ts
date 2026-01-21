import { z } from "zod";

export const personSchema = z.object({
    firstName: z.string().min(1, "Le prénom est obligatoire"),
    lastName: z.string().min(1, "Le nom est obligatoire"),
    birthDate: z.string().refine(val => !isNaN(Date.parse(val)), "Date de naissance invalide"),
    gender: z.enum(["MALE", "FEMALE"]),
    imageUrl: z.string().url("L'URL de l'image est invalide"),
    phoneNumber: z.string().min(1, "Le numéro de téléphone est obligatoire"),
    status: z.string().min(1, "Le statut est requis"),
    districtId: z.number().positive("Le District est requis"),
    tributeId: z.number().positive("Le Tribut est requis"),
    parentId: z.string().optional(),
});

export const paymentSchema = z.object({
    amountPaid: z.number().positive("Le montant doit être supérieur à 0"),
    contributionId: z.string().min(1, "ID de cotisation manquant"),
});