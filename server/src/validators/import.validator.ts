import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";

export const createImportSchema = z.object({
  unitPrice: z
    .number({
      message: "Product price must be a number.",
    })
    .positive({ message: "Unit price must be a positive number." }),
  quantity: z
    .number({ message: "Quantity must be a number." })
    .int({ message: "Quantity must be an integer." })
    .positive({ message: "Quantity must be greater than zero." }),
  orderDate: z.coerce.date({
    message: "Order date is invalid date format.",
  }),
  modeOfShipment: z
    .string({
      message: "Mode of shipment must be a string.",
    })
    .optional(),
  productId: z
    .string({
      message: "Product ID must be a string.",
    })
    .min(1, { message: "Product ID is required." }),
  supplierId: z
    .string({
      message: "Supplier ID must be a string.",
    })
    .min(1, {
      message: "Supplier ID is required.",
    }),
  competitorId: z
    .string({
      message: "Competitor ID must be a string.",
    })
    .min(1, { message: "Competitor ID is required" }),
});

export const updateImportSchema = createImportSchema.partial();

export const getImportsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
