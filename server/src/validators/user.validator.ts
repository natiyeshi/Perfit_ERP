import { Flag, User } from "@prisma/client";
import * as z from "zod";
import { authValidator } from ".";

export const updateProfile =
  authValidator.signUpSchema.partial() satisfies z.ZodType<
    Partial<Omit<User, "id" | "role">>
  >;

export const updateFlags = z.object({
  isSuspended: z.boolean({
    message: "isSuspended must be a boolean.",
  }),
}) satisfies z.ZodType<Partial<Omit<Flag, "userId">>>;
