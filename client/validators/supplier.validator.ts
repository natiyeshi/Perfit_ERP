import * as Yup from "yup";

const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/; // Adjust the regex for your phone number format

export const createSupplierSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Supplier name is required.")
    .test(
      "full-name-format",
      "Supplier full-name has to have first name and last name.",
      (value) => {
        if (!value) return true; // Allow empty if it's optional
        return value.trim().split(" ").length > 1;
      }
    ),
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email."),
  phoneNumber: Yup.string()
    .required("Phone number is required.")
    .matches(PHONE_REGEX, "Invalid phone number."),
  country: Yup.string()
    .required("Country is required.")
    .min(2, "Country must be at least 2 characters long."),
});

export const updateSupplierSchema = createSupplierSchema.noUnknown().partial();
