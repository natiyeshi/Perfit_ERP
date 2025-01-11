import * as Yup from "yup";

export const createCustomerSchema = Yup.object({
  organizationName: Yup.string()
    .trim()
    .required("Organization name is required."),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be at least 10 characters long.")
    .required("Phone number is required."),
  city: Yup.string()
    .required("City is required."),
});

export const updateCustomerSchema = createCustomerSchema.shape({
  catagory: Yup.string().optional(),
});
