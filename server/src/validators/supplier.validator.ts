import { Supplier } from "@prisma/client";
import * as z from "zod";

export const createSupplierSchema = z.object({
  manufacturerName: z
    .string({ message: "Manufacturer name must be a string." })
    .min(1, {
      message: "Manufacturer name is required.",
    }),
  email: z
    .string({ message: "Email has to be a string" })
    .email({
      message: "Invalid email.",
    })
    .optional(),
  phoneNumber: z
    .string({
      message: "Phone number must be string",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters long.",
    })
    .optional(),
  country: z
    .string({
      message: "Country has to be a string.",
    })
    .min(2, {
      message: "Country must be at least 2 characters long.",
    })
    .optional(),
});

export const updateSupplierSchema =
  createSupplierSchema.partial() satisfies z.ZodType<
    Partial<Omit<Supplier, "id">>
  >;
