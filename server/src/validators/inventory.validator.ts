import * as z from "zod";

export const createInventorySchema = z.object({
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
  quantity: z
    .number({ message: "Quantity must be a number." })
    .int({ message: "Quantity must be an integer." })
    .nonnegative({ message: "Quantity cannot be negative." }),
  unit: z
    .string()
    .max(50, { message: "Unit must be under 50 characters." })
    .optional(),
  unitPrice: z
    .number()
    .nonnegative({ message: "Unit price cannot be negative." })
    .optional(),
  totalPrice: z
    .number()
    .nonnegative({ message: "Total price cannot be negative." })
    .optional(),
  orderDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid order date.",
    }),
  shelfLife: z.number().positive(),
  modeOfShipment: z
    .string()
    .max(100, { message: "Mode of shipment must be under 100 characters." })
    .optional(),
});

export const updateInventorySchema = createInventorySchema.partial();
