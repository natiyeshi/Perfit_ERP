import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";
import { Import } from "@prisma/client";

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
  manufacturerDate: z.coerce.date({
    message: "Manufacturer date is invalid date format.",
  }),
  expiryDate: z.coerce.date({
    message: "Expiry date is invalid date format.",
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
});

export const updateImportSchema =
  createImportSchema.partial() satisfies z.ZodType<Partial<Omit<Import, "id">>>;

export const getImportsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
