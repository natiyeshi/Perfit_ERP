import * as Yup from "yup";


export const createCompetitorImportSchema = Yup.object({
  quantity: Yup.number()
    .required("Quantity is required.")
    .integer("Quantity must be an integer.")
    .positive("Quantity must be greater than zero."),
  unit: Yup.string()
    .min(1, "Unit must at least have one character.")
    .optional(),
  unitPrice: Yup.number()
    .positive("Unit price must be a positive number.")
    .optional(),
  totalPrice: Yup.number()
    .positive("Total price must be a positive number.")
    .optional(),
  orderDate: Yup.string().optional(),
  shelfLife: Yup.string().optional(),
  modeOfShipment: Yup.string().optional(),
  productId: Yup.string()
    // .uuid("Invalid product ID.")
    .required("Product ID is required."),
  supplierId: Yup.string()
    // .uuid("Invalid supplier ID.")
    .required("Supplier ID is required."),
  competiatorId: Yup.string()
    // .uuid("Invalid competitor ID.")
    .required("Competitor ID is required."),
});

export const updateCompetitorImportSchema = createCompetitorImportSchema.noUnknown().partial()

