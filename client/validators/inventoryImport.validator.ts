import * as Yup from "yup";

export const createInventoryImportSchema = Yup.object({
  unitPrice: Yup.number()
    .typeError("Product price must be a number.")
    .positive("Unit price must be a positive number.")
    .required("Unit price is required."),
  quantity: Yup.number()
    .typeError("Quantity must be a number.")
    .integer("Quantity must be an integer.")
    .positive("Quantity must be greater than zero.")
    .required("Quantity is required."),
  orderDate: Yup.date()
    .typeError("Order date is invalid date format.")
    .required("Order date is required."),
  modeOfShipment: Yup.string()
    .typeError("Mode of shipment must be a string.")
    .optional(),
  productId: Yup.string()
    .min(1, "Product ID is required.")
    .required("Product ID is required."),
  supplierId: Yup.string()
    .min(1, "Supplier ID is required.")
    .required("Supplier ID is required."),
});

export const updateInventoryImportSchema = createInventoryImportSchema.noUnknown(true).nullable();
