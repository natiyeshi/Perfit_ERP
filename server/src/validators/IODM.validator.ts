import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";

export const createIODMSchema = z.object({
  
  expiryDate: z.coerce.date({ message: "Expiry date must be a valid date." }),
  manufactureDate: z.coerce.date({
    message: "Manufacture date must be a valid date.",
  }),

  purchasePriceUsd: z
    .number({ message: "Purchase price (USD) must be a number." })
    .positive({ message: "Purchase price (USD) must be greater than zero." }),

  currentSellingPrice: z
    .number({ message: "Current selling price must be a number." })
    .positive({ message: "Current selling price must be greater than zero." }),

  productMovement: z.enum(["HIGH", "LOW", "MEDIUM"], {
    message: "Product movement must be one of 'HIGH', 'LOW', or 'MEDIUM'.",
  }),

  transportCost: z
    .number({ message: "Transport cost must be a number." })
    .nonnegative({ message: "Transport cost cannot be negative." }),

  grossWeight: z
    .number({ message: "Gross weight must be a number." })
    .positive({ message: "Gross weight must be greater than zero." }),

  cbm: z
    .number({ message: "Cubic meter (CBM) must be a number." })
    .positive({ message: "CBM must be greater than zero." }),

  freightCost: z
    .number({ message: "Freight cost must be a number." })
    .nonnegative({ message: "Freight cost cannot be negative." }),

  dutyTax: z
    .number({ message: "Duty tax must be a number." })
    .nonnegative({ message: "Duty tax cannot be negative." }),

  bsc: z
    .number({ message: "Bunker surcharge (BSC) must be a number." })
    .nonnegative({ message: "BSC cannot be negative." }),

  shipmentAmount: z
    .number({ message: "Shipment amount must be a number." })
    .nonnegative({ message: "Shipment amount cannot be negative." }),

  insuranceCharge: z
    .number({ message: "Insurance charge must be a number." })
    .nonnegative({ message: "Insurance charge cannot be negative." }),

  loadingUnloading: z
    .number({ message: "Loading/unloading cost must be a number." })
    .nonnegative({ message: "Loading/unloading cost cannot be negative." }),

  exchangeRate: z
    .number({ message: "Exchange rate must be a number." })
    .positive({ message: "Exchange rate must be greater than zero." }),

  supplierId: z
    .string({ message: "Supplier ID must be a string." })
    .min(1, { message: "Supplier ID is required." }),

  productId: z
    .string({ message: "Product ID must be a string." })
    .min(1, { message: "Product ID is required." }),
});

export const updateIODMSchema = createIODMSchema.partial();

export const getIODMsQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
