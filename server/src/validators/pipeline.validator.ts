import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";

export const createPipelineSchema = z.object({
  quantity: z
    .number({ message: "Quantity must be a number." })
    .int({ message: "Quantity must be an integer." })
    .positive({ message: "Quantity must be greater than zero." }),
  isArrived : z.boolean().default(false),
  invoice: z
    .number({ message: "Invoice must be a number." })
    .positive({ message: "Invoice must be a positive number." }),

  lcOpeningDate: z.coerce.date({ message: "Opening date must be a valid date." }),

  shippingMethod: z.enum(["AIR", "SEA"], {
    message: "Shipping method must be either 'AIR' or 'SEA'.",
  }),

  portExpectedArrivalDate: z.coerce.date({
    message: "Expected arrival at port must be a valid date.",
  }),

  warehouseExpectedArrivalDate: z.coerce.date({
    message: "Expected arrival at warehouse must be a valid date.",
  }),
  portArrivalDate: z.coerce
    .date({ message: "Arrival date at port must be a valid date." })
    .optional(),

  warehouseArrivalDate: z.coerce
    .date({ message: "Arrival date at warehouse must be a valid date." })
    .optional(),

  productId: z
    .string({ message: "Product ID must be a string." })
    .min(1, { message: "Product ID is required." }),

  lcNumber: z
    .string({ message: "Lc Number must be a string." })
    .min(1, { message: "Lc Number is required." }),

  proformaInvoiceNumber: z
    .string({ message: "Proforma Invoice Number must be a string." })
    .min(1, { message: "Proforma Invoice Number is required." }),
});

export const updatePipelineSchema = createPipelineSchema.partial();

export const getPipelinesQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
