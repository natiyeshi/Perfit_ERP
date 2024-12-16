import * as z from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const updateProfile = z.object({
  fullName: z
    .string()
    .optional()
    .refine(
      (fullName) => {
        if (!fullName) return true;
        return fullName.split(" ").length > 1;
      },
      {
        message: "User full-name has to have first name and last name",
      }
    ),
  email: z.string().refine(
    (email) => {
      if (!email) return true;
      return EMAIL_REGEX.test(email);
    },
    {
      message: "Invalid email.",
    }
  ),
  password: z.string({ message: "Password has to be a string" }).trim().min(1, {
    message: "Password field is required.",
  }),
});

export const updateFlags = z.object({
  isSuspended: z.boolean({
    message: "isSuspended must be a boolean.",
  }),
});
