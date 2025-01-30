import * as Yup from "yup";

export const updateInventorySchema = Yup.object({
  quantity: Yup.number()
    .typeError("Quantity must be a number.")
    .integer("Quantity must be an integer.")
    .positive("Quantity must be a positive number.")
    .required("Quantity is required."),
  unitPrice: Yup.number()
    .typeError("Unit price must be a number.")
    .positive("Unit price must be a positive number.")
    .optional(),
});
