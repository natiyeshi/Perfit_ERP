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
  shelfLife: z
    .string({
      message: "Shelf life must be a string.",
    })
    .optional(),
  modeOfShipment: z
    .string({
      message: "Mode of shipment must be a string.",
    })
    .optional(),
  productId: z.string().uuid({ message: "Invalid product ID." }),
  supplierId: z.string().uuid({ message: "Invalid supplier ID." }),
  competiatorId: z.string().uuid({ message: "Invalid competitor ID." }),
});

export const updateCompetitorImportSchema = createCompetitorImportSchema.partial();
