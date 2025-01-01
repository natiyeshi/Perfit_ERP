import { Customer } from "@prisma/client";
import * as z from "zod";

export const createCustomerSchema = z.object({
  organizationName: z
    .string({ message: "Organization name must be a string." })
    .trim()
    .min(1, { message: "Organization name is required." }),
  phoneNumber: z
    .string({
      message: "Phone number must be string",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters long.",
    }),
  city: z
    .string({
      message: "City has to be a string.",
    })
    .min(1, {
      message: "City is required.",
    }),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  catagory: z
    .string({
      message: "Catagory must be a string.",
    })
    .min(1, {
      message: "Catagory is required.",
    })
    .optional(),
}) satisfies z.ZodType<Partial<Omit<Customer, "id" | "catagory">>>;
