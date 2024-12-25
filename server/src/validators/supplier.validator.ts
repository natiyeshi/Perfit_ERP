import * as z from "zod";

// const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/; // Adjust the regex for your phone number format

export const createSupplierSchema = z.object({
  name: z.string({ message: "Supplier name must be a string." }).min(1, {
    message: "Supplier name is required.",
  }),
  email: z.string({ message: "Email has to be a string" }).email({
    message: "Invalid email.",
  }),
  phoneNumber: z
    .string({
      message: "Phone number must be string",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters long.",
    })
    .optional(),
  country: z
    .string({
      message: "Country has to be a string.",
    })
    .min(2, {
      message: "Country must be at least 2 characters long.",
    }),
});

export const updateSupplierSchema = createSupplierSchema.partial();
