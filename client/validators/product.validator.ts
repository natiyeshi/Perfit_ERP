import * as Yup from "yup";

export const createProductSchema = Yup.object({
  name: Yup.string()
    .required("Product name is required.")
    .typeError("Product name must be a string."),
  unitPrice: Yup.number()
    .positive("Unit price must be a positive number.")
    .required("Unit price is required.")
    .typeError("Unit price must be a number."),
  shelfLife: Yup.number()
  .required("Shelf Life is required.")
  .typeError("Shelf Life must be a number."),
  brand: Yup.string()
    .nullable()
    .optional()
    .typeError("Brand must be a string."),
});

export const updateProductSchema = createProductSchema.shape({
  name: Yup.string().optional(),
  unitPrice: Yup.number().optional(),
});
