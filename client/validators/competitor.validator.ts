import * as Yup from "yup";

export const createCompetitorImportSchema = Yup.object().shape({
  quantity: Yup.number()
    .integer("Quantity must be an integer.")
    .positive("Quantity must be greater than zero.")
    .required("Quantity must be a number."),
  unit: Yup.string()
    .min(1, "Unit must at least have one character.")
    .notRequired(),
  unitPrice: Yup.number()
    .positive("Unit price must be a positive number.")
    .notRequired(),
  totalPrice: Yup.number()
    .positive("Total price must be a positive number.")
    .notRequired(),
  orderDate: Yup.string().notRequired(),
  shelfLife: Yup.number()
    .positive("Shelf life must be a positive number.")
    .notRequired(),
  modeOfShipment: Yup.string()
    .notRequired()
    .typeError("Mode of shipment must be a string."),
  productId: Yup.string()
    .min(1, "Product ID is required.")
    .required("Product ID must be a string."),
  supplierId: Yup.string()
    .min(1, "Supplier ID is required.")
    .required("Supplier ID must be a string."),
  competitorId: Yup.string()
    .min(1, "Competitor ID is required.")
    .required("Competitor ID must be a string."),
});

export const updateCompetitorImportSchema = createCompetitorImportSchema.noUnknown().nullable().defined();
