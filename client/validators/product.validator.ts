import * as Yup from "yup";

export const createProductSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required.")
    .typeError("Product name must be a string."),
  shelfLife: Yup.number()
    .required("Product shelf life is required.")
    .positive("Product life must be a positive number.")
    .typeError("Product life must be a number."),
  brand: Yup.string()
    .required("Brand for product is required.")
    .typeError("Brand must be a string."),
  unit: Yup.string()
    .required("Product unit is required.")
    .typeError("Product unit must be a string."),
});

export const updateProductSchema = createProductSchema.noUnknown().shape({
  name: Yup.string().notRequired(),
  shelfLife: Yup.number().notRequired(),
  brand: Yup.string().notRequired(),
  unit: Yup.string().notRequired(),
});
