import { z } from "zod";

export const createLoanSchema = z.object({
  lender: z.string().min(1, { message: "Lender name is required" }),
  amount: z.coerce
    .number()
    .positive({ message: "Loan amount must be positive" }),
  interestRate: z.coerce
    .number()
    .min(0, { message: "Interest rate cannot be negative" }), // Allow 0%
  dueDate: z.coerce.date({ message: "Invalid due date" }),
});
