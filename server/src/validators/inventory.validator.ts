import * as z from "zod";

export const createInventorySchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID." }),
  supplierId: z.string().uuid({ message: "Invalid supplier ID." }),
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
  shelfLife: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid shelf life date.",
    }),
  modeOfShipment: z
    .string()
    .max(100, { message: "Mode of shipment must be under 100 characters." })
    .optional(),
});

export const updateInventorySchema = createInventorySchema.partial();
