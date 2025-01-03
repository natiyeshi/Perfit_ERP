import * as Yup from "yup";

const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

export const createCompetitorSchema = Yup.object({
  name: Yup.string()
    .test(
      "minLength",
      "Competitor name has to have at least one character.",
      (name) => !name || name.length > 1
    )
    .required("Competitor name must be a string."),
  email: Yup.string()
    .email("Competitor email isn't a valid email address")
    .optional(),
  phoneNumber: Yup.string()
    .matches(PHONE_REGEX, "Phone number must be string")
    .min(10, "Phone number must be at least 10 characters long.")
    .optional(),
  country: Yup.string()
    .typeError("Competitor country must be a valid country.")
    .optional(),
});


export const updateCompetitorImportSchema = createCompetitorSchema.noUnknown().optional().defined();
