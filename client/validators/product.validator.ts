import * as yup from "yup";

export const createProductSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required.")
    .typeError("Product name must be a string."),
  brand: yup
    .string()
    .required("Brand for product is required.")
    .typeError("Brand must be a string."),
  unit: yup
    .string()
    .required("Product unit is required.")
    .typeError("Product unit must be a string."),
});

export const updateProductSchema = createProductSchema.noUnknown().shape({
  name: yup.string(),
  brand: yup.string(),
  unit: yup.string(),
});
