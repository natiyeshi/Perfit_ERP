import * as z from "zod";

const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/; // Adjust the regex for your phone number format

export const createSupplierSchema = z.object({
  fullName: z.string({ message: "Supplier name must be a string." }).refine(
    (fullName) => {
      if (!fullName) return true;
      return fullName.split(" ").length > 1;
    },
    {
      message: "Supplier full-name has to have first name and last name",
    }
  ),
  email: z.string({ message: "Email has to be a string" }).email({
    message: "Invalid email.",
  }),
  phoneNumber: z
    .string({
      message: "Phone-number has to be a string.",
    })
    .refine((phoneNumber) => PHONE_REGEX.test(phoneNumber), {
      message: "Invalid phone number.",
    }),
  country: z
    .string({
      message: "Country has to be a string.",
    })
    .min(2, {
      message: "Country must be at least 2 characters long.",
    }),
});

export const updateSupplierSchema = createSupplierSchema.partial();
