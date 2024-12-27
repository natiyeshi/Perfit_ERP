import * as Yup from "yup";

export const createInventorySchema = Yup.object().shape({
  productId: Yup.string()
    .required("Product ID is required.")
    .typeError("Product ID must be a string."),
  supplierId: Yup.string()
    .required("Supplier ID is required.")
    .typeError("Supplier ID must be a string."),
  quantity: Yup.number()
    .required("Quantity is required.")
    .integer("Quantity must be an integer.")
    .min(0, "Quantity cannot be negative.")
    .typeError("Quantity must be a number."),
  unit: Yup.string()
    .max(50, "Unit must be under 50 characters.")
    .optional(),
  unitPrice: Yup.number()
    .min(0, "Unit price cannot be negative.")
    .typeError("Unit price must be a number.")
    .optional(),
  totalPrice: Yup.number()
    .min(0, "Total price cannot be negative.")
    .typeError("Total price must be a number.")
    .optional(),
  orderDate: Yup.string()
    .test("is-valid-date", "Invalid order date.", (value) =>
      !value || !isNaN(Date.parse(value))
    )
    .optional(),
  shelfLife: Yup.number()
    .required("Shelf life is required.")
    .positive("Shelf life must be a positive number.")
    .typeError("Shelf life must be a number."),
  modeOfShipment: Yup.string()
    .max(100, "Mode of shipment must be under 100 characters.")
    .optional(),
});

export const updateInventorySchema = createInventorySchema.noUnknown().shape({
  productId: Yup.string().optional(),
  supplierId: Yup.string().optional(),
  quantity: Yup.number().optional(),
  unit: Yup.string().optional(),
  unitPrice: Yup.number().optional(),
  totalPrice: Yup.number().optional(),
  orderDate: Yup.string().optional(),
  shelfLife: Yup.number().optional(),
  modeOfShipment: Yup.string().optional(),
});
