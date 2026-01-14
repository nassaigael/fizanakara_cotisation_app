import { z } from "zod";

export const PaymentSchema = z.object({
    amountPaid: z.number().positive("Le montant doit être supérieur à 0"),
    contributionId: z.string().min(1, "ID de contribution requis"), 
});

export const ContributionUpdateSchema = z.object({
    amount: z.number().nonnegative("Le montant ne peut pas être négatif").optional(),
    status: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE"]).optional(),
    memberId: z.string().min(1, "ID membre requis"),
});