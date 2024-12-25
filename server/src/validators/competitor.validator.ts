import * as z from "zod";

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
    .email({
      message: "Competitor email isn't a valid email address",
    })
    .optional(),
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
      message: "Competitor country must be a valid country.",
    })
    .optional(),
});

export const updateCompetitorSchema = createCompetitorSchema.partial();
