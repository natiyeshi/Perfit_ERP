import * as Yup from "yup";

export const createTransactionSchema = Yup.object({
  unitPrice: Yup.number()
    .typeError("Product price must be a number.")
    .positive("Unit price must be a positive number.")
    .required("Unit price is required."),
  quantity: Yup.number()
    .min(1, "Quantity must be greater than zero.")
    .typeError("Quantity must be a number.")
    .positive("Quantity must be a positive number.")
    .required("Quantity is required."),
  productId: Yup.string()
    .min(1, "Product ID is required.")
    .required("Product ID is required."),
  customerId: Yup.string()
    .min(1, "Customer ID is required.")
    .required("Customer ID is required."),
  salesPersonId: Yup.string()
    .min(1, "SalesPerson ID is required.")
    .required("SalesPerson ID is required."),
});

export const updateTransactionSchema = createTransactionSchema.noUnknown(true).nullable();

