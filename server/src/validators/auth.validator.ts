import { UserRole } from "@prisma/client";
import * as z from "zod";

export const signUpSchema = z.object({
  fullName: z
    .string({ message: "User full-name has to be a string" })
    .trim()
    .min(1, {
      message: "User full-name is required.",
    })
    .refine((fullName) => fullName.split(" ").length > 1, {
      message: "User full-name has to have first name and last name",
    }),
  email: z.string({ message: "Email has to be a string" }).email({
    message: "Invalid email.",
  }),
  password: z.string({ message: "Password has to be a string" }).trim().min(1, {
    message: "Password field is required.",
  }),
});

export const signInSchema = z.object({
  email: z.string({ message: "Email has to be a string" }).email({
    message: "Invalid email.",
  }),
  password: z.string({ message: "Password has to be a string" }).trim().min(1, {
    message: "Password field is required.",
  }),
});

export const updateUserRoleSchema = z.object({
  userId: z
    .string({
      message: "UserId has to be a string",
    })
    .min(1, {
      message: "UserId field is required.",
    }),
  role: z.enum(
    [
      UserRole.UNKNOWN,
      UserRole.SALES_PERSON,
      UserRole.DATA_AGGREGATOR,
      UserRole.ADMIN,
    ],
    {
      message: "Invalid user role.",
    }
  ),
});
