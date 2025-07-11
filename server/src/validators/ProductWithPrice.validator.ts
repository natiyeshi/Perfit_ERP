import { z } from "zod";

export const ProductWithPriceSchema = z.object({
    productId: z.string({ required_error: "productId is required" }),
    unitPrice: z.number({ required_error: "unitPrice is required" }),
    quantity: z.number({ required_error: "quantity is required" }).int(),
});

export type ProductWithPrice = z.infer<typeof ProductWithPriceSchema>;