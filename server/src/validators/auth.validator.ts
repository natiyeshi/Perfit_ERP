import { ROLE } from "@prisma/client";
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

export const updateROLESchema = z.object({
  userId: z
    .string({
      message: "UserId has to be a string",
    })
    .min(1, {
      message: "UserId field is required.",
    }),
  role: z.enum(
    [ROLE.UNKNOWN, ROLE.SALES_PERSON, ROLE.DATA_AGGREGATOR, ROLE.ADMIN],
    {
      message: "Invalid user role.",
    }
  ),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ message: "Old password has to be a string" })
    .trim()
    .min(1, {
      message: "Old password field is required.",
    }),
  newPassword: z
    .string({ message: "New password has to be a string" })
    .trim()
    .min(1, {
      message: "New password field is required.",
    }),
});
