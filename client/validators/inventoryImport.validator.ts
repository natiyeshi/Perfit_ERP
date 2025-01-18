import * as Yup from "yup";

export const createInventoryImportSchema = Yup.object({
  unitPrice: Yup.number()
    .positive("Unit price must be a positive number.")
    .required("Product price must be a number."),
    
  quantity: Yup.number()
    .integer("Quantity must be an integer.")
    .positive("Quantity must be greater than zero.")
    .required("Quantity must be a number."),
  manufacturerDate: Yup.date()
    .typeError("Manufacturer date is invalid date format.")
    .required("Manufacturer date is required."),
  expiryDate: Yup.date()
    .typeError("Expiry date is invalid date format.")
    .required("Expiry date is required."),
  modeOfShipment: Yup.string().optional(),
  productId: Yup.string()
    .min(1, "Product ID is required.")
    .required("Product ID must be a string."),
  supplierId: Yup.string()
    .min(1, "Supplier ID is required.")
    .required("Supplier ID must be a string."),
  batch: Yup
        .string()
        .required("Product batch is required.")
        .typeError("Product batch must be a string."),
});

export const updateInventoryImportSchema = createInventoryImportSchema.noUnknown(true).nullable();
