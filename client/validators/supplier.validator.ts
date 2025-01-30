import * as Yup from "yup";


export const createSupplierSchema = Yup.object().shape({
  manufacturerName: Yup
    .string()
    .required("Manufacturer name is required."),
  email: Yup
    .string()
    .email("Invalid email.")
    .optional(),
  phoneNumber: Yup
    .string()
    .min(10, "Phone number must be at least 10 characters long.")
    .optional(),
  country: Yup
    .string()
    .min(2, "Country must be at least 2 characters long.")
    .optional(),
  productIDs: Yup
    .array()
    .of(Yup.string())
    .optional(),
});

export const updateSupplierSchema = createSupplierSchema.noUnknown().partial();
