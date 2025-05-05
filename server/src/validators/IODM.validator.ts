import { z } from "zod";
import { lastDaysQueryValidator, paginationsQueryValidator } from "./query.validator";
import { MOVEMENT } from "@prisma/client";


export const IODMProductSchema = z.object({

  productId: z
    .string({ required_error: "Product ID is required" })
    .min(1, "Product ID cannot be empty"),

  purchasePriceUsd: z
    .number({ required_error: "Purchase price (USD) is required" })
    .nonnegative("Purchase price cannot be negative"),

  currentSellingPrice: z
    .number({ required_error: "Current selling price is required" })
    .positive("Current selling price must be greater than 0"),

  productMovement: z.nativeEnum(MOVEMENT, {
    required_error: "Product movement is required",
    invalid_type_error: "Invalid product movement type",
  }),

  expiryDate: z.string({
    required_error: "Expiry date is required",
    invalid_type_error: "Expiry date must be a valid date",
  }),

  manufactureDate: z.string({
    required_error: "Manufacture date is required",
    invalid_type_error: "Manufacture date must be a valid date",
  }),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),


});

export const IODMSchema = z.object({

  bsc: z
    .number({ required_error: "BSC is required" })
    .nonnegative("BSC cannot be negative"),

  dutyTax: z
    .number({ required_error: "Duty tax is required" })
    .nonnegative("Duty tax cannot be negative"),

  supplierId: z
    .string({ required_error: "Supplier ID is required" })
    .min(1, "Supplier ID cannot be empty"),

  loadingUnloading: z
    .number({ required_error: "Loading/Unloading cost is required" })
    .nonnegative("Loading/Unloading cost cannot be negative"),

  exchangeRate: z
    .number({ required_error: "Exchange rate is required" })
    .positive("Exchange rate must be greater than 0"),

  insuranceCharge: z
    .number({ required_error: "Insurance charge is required" })
    .nonnegative("Insurance charge cannot be negative"),

  IODMProducts: z
    .array(IODMProductSchema, {
      required_error: "At least one IODM product is required",
    })
    .min(1, "At least one IODM product must be provided"),

    
    freightCost: z
      .number({ required_error: "Freight cost is required" })
      .nonnegative("Freight cost cannot be negative"),

    miscellaneousTax: z
      .number({ required_error: "Miscellaneous tax is required" })
      .nonnegative("Miscellaneous tax cannot be negative"),
});


export const updateIODMSchema = IODMSchema.partial();

export const getIODMsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
