import * as Yup from "yup";

const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/; // Adjust the regex for your phone number format

export const createSupplierSchema = Yup.object().shape({
  name: Yup.string()
    .required("Supplier name is required.")
    .min(1),
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
