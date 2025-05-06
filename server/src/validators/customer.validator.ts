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
    .min(7, {
      message: "Phone number must be at least 7 characters long.",
    }),
  city: z
    .string({
      message: "City has to be a string.",
    })
    .min(1, {
      message: "City is required.",
    }),
  tinNumber: z
    .string({
      message: "Tin Number is Required",
    }),
});

export const createManyCustomersSchema = z.object({
  customers: z.array(createCustomerSchema, {
    message: "Customers must be an array of valid customer objects.",
  }).min(1, {
    message: "At least one customer must be provided.",
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
