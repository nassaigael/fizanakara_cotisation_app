import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Email invalide"),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, "Le jeton est requis"),
    newPassword: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});