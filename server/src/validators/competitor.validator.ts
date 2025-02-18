import { Competitor } from "@prisma/client";
import * as z from "zod";

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

  isDirectCompetitor: z.boolean({
    message: "Is direct competitor status must be a boolean.",
  }),
});

export const updateCompetitorSchema =
  createCompetitorSchema.partial() satisfies z.ZodType<
    Partial<Omit<Competitor, "id">>
  >;
