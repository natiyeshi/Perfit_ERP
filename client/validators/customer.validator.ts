import * as Yup from "yup";

export const createCustomerSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required and must be a string.")
    .trim()
    .test(
      "is-full-name",
      "Full name must include at least first and last names.",
      (value) => value?.split(" ").length > 1
    ),
});

export const updateCustomerSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .nullable()
    .test(
      "is-full-name",
      "Full name must include at least first and last names.",
      (value) => !value || value.split(" ").length > 1
    ),
  label: Yup.string().nullable(),
});
