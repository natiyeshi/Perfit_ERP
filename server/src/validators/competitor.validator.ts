import * as z from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

export const createCompetitorSchema = z.object({
  name: z.string({ message: "Competitor name must be a string." }).refine(
    (name) => {
      if (!name) return true;
      return name.length > 1;
    },
    {
      message: "Competitor name has to have at least one character.",
    }
  ),
  email: z
    .string()
    .optional()
    .refine((email) => !email || EMAIL_REGEX.test(email), {
      message: "Invalid email.",
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((phoneNumber) => !phoneNumber || PHONE_REGEX.test(phoneNumber), {
      message: "Invalid phone number.",
    }),
  country: z
    .string()
    .optional()
    .refine((country) => !country || country.length > 2, {
      message: "Invalid country",
    }),
});

export const updateCompetitorSchema = createCompetitorSchema.partial();
