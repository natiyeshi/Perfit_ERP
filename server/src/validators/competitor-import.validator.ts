import * as z from "zod";

export const createCompetitorImportSchema = z.object({
  quantity: z
    .number({ message: "Quantity must be a number." })
    .int({ message: "Quantity must be an integer." })
    .positive({ message: "Quantity must be greater than zero." }),
  unit: z
    .string({
      message: "Unit must be a string.",
    })
    .min(1, {
      message: "Unit must at least have one character.",
    })
    .optional(),
  unitPrice: z
    .number()
    .positive({ message: "Unit price must be a positive number." })
    .optional(),
  totalPrice: z
    .number()
    .positive({ message: "Total price must be a positive number." })
    .optional(),
  orderDate: z
    .string({
      message: "Order date must be a string.",
    })
    .optional(),
  shelfLife: z.number().positive().optional(),
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

export const updateCompetitorImportSchema =
  createCompetitorImportSchema.partial();
