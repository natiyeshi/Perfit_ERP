import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";

export const updateInventorySchema = z.object({
  quantity: z
    .number({ message: "Quantity must be a number." })
    .int({ message: "Quantity must be an integer." })
    .positive({ message: "Quantity must be positive number." }),
  unitPrice: z
    .number()
    .positive({ message: "Unit price must be positive number." })
    .optional(),
});

export const getCompetitorImportsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
