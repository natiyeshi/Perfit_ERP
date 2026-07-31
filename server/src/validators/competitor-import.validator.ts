import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";
import { CompetitorImport } from "@prisma/client";
export const createCompetitorImportSchema = z.object({
  importId: z
    .string({
      message: "Import ID must be a string.",
    })
    .min(1, { message: "Import ID is required." }),
  amount: z
    .number({
      message: "Amount must be a number.",
    })
    .positive({ message: "Amount must be a positive number." }),
  paymentMode: z
    .string({
      message: "Payment mode must be a string.",
    })
    .optional(),
  modeOfShipment: z
    .string({
      message: "Mode of shipment must be a string.",
    })
    .optional(),
  currency: z
    .string({
      message: "Currency must be a string.",
    })
    .optional(),
  products: z.array(
    z.object({
      productId: z.string({ required_error: "productId is required" }),
      unitPrice: z.number({ required_error: "unitPrice is required" }),
      quantity: z.number({ required_error: "quantity is required" }).int(),
    })
  ),
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
    .min(1, { message: "Competitor ID is required." }),
  date: z
    .preprocess(
      (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
      z.date({ message: "Date must be a valid date." })
    ),
});

export const updateCompetitorImportSchema =
  createCompetitorImportSchema.partial() as z.ZodType<
    Partial<Omit<CompetitorImport, "id" | "createdAt">>
  >;

export const getCompetitorImportsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
    search: z
      .string()
      .trim()
      .optional(),
    sortBy: z
      .enum(["date", "amount", "createdAt"])
      .optional(),
    order: z
      .enum(["asc", "desc"])
      .optional(),
  });

export const getAverageUnitPriceQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    search: z.string().trim().optional(),
    order: z.enum(["asc", "desc"]).optional(),
  });

export const getImportAnalyticsQuerySchema = lastDaysQueryValidator.extend({
  metric: z.enum([
    "competitor_total_price",
    "supplier_total_value",
    "product_quantity",
  ]),
  order: z.enum(["asc", "desc"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
