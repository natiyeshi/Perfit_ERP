import { Product } from "@prisma/client";
import * as z from "zod";
export const createProductSchema = z.object({
  productId: z
    .string({ message: "Product Id must be a string." })
    .min(1, { message: "Product Id is required." })
    .optional(),
  brandName: z
    .string({ message: "Brand name must be a string." })
    .min(1, { message: "Brand name is required." }),
  genericName: z
    .string({ message: "Generic name must be a string." })
    .min(1, { message: "Generic name is required." }),
  supplierId: z
    .string({ message: "Supplier Id must be a string." })
    .optional(),
  unit: z
    .string({ message: "Unit must be a string." })
    .optional(),
  description: z
    .string({ message: "Description must be a string." })
    .optional(),
  intendedUse: z
    .string({ message: "Intended use must be a string." })
    .optional(),
});

export const createProductsArraySchema = z.array(createProductSchema);

export const updateProductSchema =
  createProductSchema.partial() satisfies z.ZodType<
    Partial<Omit<Product, "id">>
  >;
