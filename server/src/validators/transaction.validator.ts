import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";

export const createTransactionSchema = z.object({
  unitPrice: z
    .number({
      message: "Product price must be a number.",
    })
    .positive({ message: "Unit price must be a positive number." }),
  quantity: z.number().min(1, "Quantity must be greater than zero.").positive({
    message: "Quantity must be a positive number.",
  }),
  productId: z.string().min(1, "Product ID is required."),
  customerId: z.string().min(1, "Customer ID is required."),
  salesPersonId: z.string().min(1, "SalesPerson ID is required."),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const getTransactionsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
