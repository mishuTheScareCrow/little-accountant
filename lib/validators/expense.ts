import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive" }), // coerce handles string conversion
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  date: z.coerce.date({ message: "Invalid date format" }), // coerce handles string/number conversion
});
