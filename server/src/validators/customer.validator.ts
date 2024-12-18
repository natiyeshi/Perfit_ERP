import { CUSTOMER_LABEL } from "@prisma/client";
import * as z from "zod";

export const createCustomerSchema = z.object({
  fullName: z
    .string({ message: "Full name is required and must be a string." })
    .trim()
    .min(1, { message: "Full name cannot be empty." })
    .refine((name) => name.split(" ").length > 1, {
      message: "Full name must include at least first and last names.",
    }),
});

export const updateCustomerSchema = z.object({
  fullName: z
    .string()
    .optional()
    .refine((fullName) => !fullName || fullName.split(" ").length > 1, {
      message: "Full name must include at least first and last names.",
    }),
  label: z
    .enum([...Object.values(CUSTOMER_LABEL)] as [keyof typeof CUSTOMER_LABEL], {
      message: "Invalid label.",
    })
    .optional(),
});
