import * as z from "zod";

export const createProductCategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
});

export const updateProductCategorySchema = z.object({
  name: z.string().optional(),
});
