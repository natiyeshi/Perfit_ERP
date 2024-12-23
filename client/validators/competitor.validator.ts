import * as yup from "yup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

export const createCompetitorSchema = yup.object({
  name: yup
    .string()
    .test("name-length", "Competitor name has to have at least one character.", (name) => {
      if (!name) return true;
      return name.length > 1;
    }),
  email: yup
    .string()
    .optional()
    .matches(EMAIL_REGEX, { message: "Invalid email." }),
  phoneNumber: yup
    .string()
    .optional()
    .matches(PHONE_REGEX, { message: "Invalid phone number." }),
  country: yup
    .string()
    .optional()
    .test("country-length", "Invalid country", (country) => !country || country.length > 2),
});

export const updateCompetitorSchema = createCompetitorSchema.noUnknown().shape({
  name: yup.string().optional(),
  email: yup.string().optional(),
  phoneNumber: yup.string().optional(),
  country: yup.string().optional(),
});


