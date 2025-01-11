import { Product } from "@prisma/client";
import * as z from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ message: "Product name must be a string." })
    .min(1, { message: "Product name is required." }),
  batch: z.string({
    message: "Product batch must be a string",
  }),
  brand: z.string({ message: "Brand must be a string." }).min(1, {
    message: "Brand for product is required.",
  }),
  unit: z
    .string({
      message: "Product unit must be a string",
    })
    .min(1, {
      message: "Product unit is required.",
    }),
});

export const updateProductSchema =
  createProductSchema.partial() satisfies z.ZodType<
    Partial<Omit<Product, "id">>
  >;
