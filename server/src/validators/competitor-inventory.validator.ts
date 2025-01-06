import * as z from "zod";
import {
  paginationsQueryValidator,
  lastDaysQueryValidator,
} from "./query.validator";
import { CompetitorInventory } from "@prisma/client";

export const createCompetitorInventorySchema = z.object({
  sellingPrice: z
    .number({ message: "Selling price must be a number." })
    .positive({ message: "Selling price must be greater than zero." }),
  productId: z
    .string({ message: "Product ID must be a string." })
    .min(1, { message: "Product ID is required." }),
  competitorId: z
    .string({ message: "Competitor ID must be a string." })
    .min(1, { message: "Competitor ID is required." }),
});

export const updateCompetitorInventorySchema =
  createCompetitorInventorySchema.partial() satisfies z.ZodType<
    Partial<Omit<CompetitorInventory, "id" | "createdAt">>
  >;

export const getCompetitorInventoriesQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
