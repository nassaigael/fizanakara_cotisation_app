import { z } from "zod";

const currentYear = new Date().getFullYear();

export const contributionYearSchema = z.object({
    year: z.number()
        .int()
        .min(2000, "Année invalide")
        .max(currentYear + 5, "Année trop lointaine"),
});

export const updateContributionSchema = z.object({
    amount: z.number().positive("Le montant doit être supérieur à 0").optional(),
    status: z.string().optional(),
    memberId: z.string().min(1, "ID membre requis"),
});