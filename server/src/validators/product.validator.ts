import * as z from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ message: "Product name must be a string." })
    .min(1, { message: "Product name is required." }),
  unitPrice: z
    .number({ message: "Unit price must be a number." })
    .positive({ message: "Unit price must be a positive number." }),
  shelfLife: z.string().optional(),
  brand: z.string({ message: "Brand must be a string." }).optional(),
});

export const updateProductSchema = createProductSchema.partial();

