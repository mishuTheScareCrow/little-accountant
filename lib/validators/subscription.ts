import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Subscription name is required" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive" }),
  cycle: z.enum(["Monthly", "Yearly"]), // Example cycle options
  nextBillingDate: z.coerce.date({
    message: "Invalid next billing date",
  }),
});
