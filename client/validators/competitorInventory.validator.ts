import * as yup from "yup";

export const createCompetitorInventorySchema = yup.object().shape({
  sellingPrice: yup
    .number()
    .typeError("Selling price must be a number.")
    .positive("Selling price must be greater than zero.")
    .required("Selling price is required."),
  productId: yup
    .string()
    .typeError("Product ID must be a string.")
    .min(1, "Product ID is required.")
    .required("Product ID is required."),
  competitorId: yup
    .string()
    .typeError("Competitor ID must be a string.")
    .min(1, "Competitor ID is required.")
    .required("Competitor ID is required."),
});
