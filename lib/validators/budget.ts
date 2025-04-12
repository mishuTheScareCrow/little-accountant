import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  limitAmount: z.coerce
    .number()
    .positive({ message: "Limit must be positive" }),
  month: z.coerce.number().int().min(1).max(12), // 1-12
  year: z.coerce
    .number()
    .int()
    .min(new Date().getFullYear() - 10)
    .max(new Date().getFullYear() + 10),
});
