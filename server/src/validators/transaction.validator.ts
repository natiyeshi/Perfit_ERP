import * as z from "zod";

export const createTransactionSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required."),
  salesPersonId: z.string().min(1, "SalesPerson ID is required."),
  quantity: z.number().min(1, "Quantity must be greater than zero.").positive({
    message: "Quantity must be a positive number.",
  }),
  totalPrice: z.number().positive({
    message: "Total price must be a positive number.",
  }),
});

export const updateTransactionSchema = createTransactionSchema.partial();
