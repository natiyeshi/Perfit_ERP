import { Competitor } from "@prisma/client";
import * as z from "zod";

export const createCompetitorSchema = z.object({
  name: z
    .string({ message: "Name must be a string." })
    .min(1, {
      message: "Name is required.",
    }),
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
