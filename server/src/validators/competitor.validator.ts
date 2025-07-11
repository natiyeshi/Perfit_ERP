import { Competitor } from "@prisma/client";
import * as z from "zod";

export const createCompetitorSchema = z.object({

  name: z
    .string({ message: "Name must be a string." })
    .min(1, {
      message: "Name is required.",
    }),
  competitorId: z
    .string({ message: "Competitor ID must be a string." })
    .min(1, {
      message: "Competitor ID is required.",
    })
    .optional(),
  email: z
    .string({ message: "Email has to be a string" })
    .email({
      message: "Invalid email.",
    })
    .nullable()
    .optional(),
  phoneNumber: z
    .string({
      message: "Phone number must be string",
    })
    .min(7, {
      message: "Phone number must be at least 7 characters long.",
    })
    .optional(),
  tin: z
    .string({
      message: "Tin has to be a string.",
    })
    .optional(),
  licenseNumber: z
    .string({
      message: "licenseNumber has to be a string.",
    })
    .optional(),
  isDirectCompetitor: z
    .boolean({
      message: "Is direct competitor must be a boolean.",
    })
    .optional(),
});

export const updateCompetitorSchema =
  createCompetitorSchema.partial() satisfies z.ZodType<
    Partial<Omit<Competitor, "id">>
  >;

export const createMultipleCompetitorsSchema = z.union([
  z.object({
    competitors: z.array(createCompetitorSchema).min(1, {
      message: "At least one competitor is required.",
    }),
  }),
  z.array(createCompetitorSchema).min(1, {
    message: "At least one competitor is required.",
  }),
]);

