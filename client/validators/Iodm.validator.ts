import * as yup from "yup";

export const createIODMSchema = yup.object().shape({
  expiryDate: yup
    .date()
    .typeError("Expiry date must be a valid date.")
    .required("Expiry date is required."),
  manufactureDate: yup
    .date()
    .typeError("Manufacture date must be a valid date.")
    .required("Manufacture date is required."),
  purchasePriceUsd: yup
    .number()
    .typeError("Purchase price (USD) must be a number.")
    .positive("Purchase price (USD) must be greater than zero.")
    .required("Purchase price (USD) is required."),
  currentSellingPrice: yup
    .number()
    .typeError("Current selling price must be a number.")
    .positive("Current selling price must be greater than zero.")
    .required("Current selling price is required."),
  productMovement: yup
    .string()
    .oneOf(["HIGH", "LOW", "MEDIUM"], "Product movement must be one of 'HIGH', 'LOW', or 'MEDIUM'.")
    .required("Product movement is required."),
  transportCost: yup
    .number()
    .typeError("Transport cost must be a number.")
    .min(0, "Transport cost cannot be negative.")
    .required("Transport cost is required."),
  grossWeight: yup
    .number()
    .typeError("Gross weight must be a number.")
    .positive("Gross weight must be greater than zero.")
    .required("Gross weight is required."),
  cbm: yup
    .number()
    .typeError("Cubic meter (CBM) must be a number.")
    .positive("CBM must be greater than zero.")
    .required("CBM is required."),
  freightCost: yup
    .number()
    .typeError("Freight cost must be a number.")
    .min(0, "Freight cost cannot be negative.")
    .required("Freight cost is required."),
  dutyTax: yup
    .number()
    .typeError("Duty tax must be a number.")
    .min(0, "Duty tax cannot be negative.")
    .required("Duty tax is required."),
  bsc: yup
    .number()
    .typeError("Bunker surcharge (BSC) must be a number.")
    .min(0, "BSC cannot be negative.")
    .required("BSC is required."),
  shipmentAmount: yup
    .number()
    .typeError("Shipment amount must be a number.")
    .min(0, "Shipment amount cannot be negative.")
    .required("Shipment amount is required."),
  insuranceCharge: yup
    .number()
    .typeError("Insurance charge must be a number.")
    .min(0, "Insurance charge cannot be negative.")
    .required("Insurance charge is required."),
  loadingUnloading: yup
    .number()
    .typeError("Loading/unloading cost must be a number.")
    .min(0, "Loading/unloading cost cannot be negative.")
    .required("Loading/unloading cost is required."),
  exchangeRate: yup
    .number()
    .typeError("Exchange rate must be a number.")
    .positive("Exchange rate must be greater than zero.")
    .required("Exchange rate is required."),
  supplierId: yup
    .string()
    .typeError("Supplier ID must be a string.")
    .min(1, "Supplier ID is required.")
    .required("Supplier ID is required."),
  productId: yup
    .string()
    .typeError("Product ID must be a string.")
    .min(1, "Product ID is required.")
    .required("Product ID is required."),
});

export const updateIODMSchema = createIODMSchema.noUnknown(true).shape({
  expiryDate: yup.date().notRequired(),
  manufactureDate: yup.date().notRequired(),
});

export const getIODMsQuerySchema = yup.object().shape({
  populate: yup
    .string()
    .oneOf(["true", "false"], "Populate must be a boolean.")
    .notRequired(),
  // Extend additional fields from `paginationsQueryValidator` and `lastDaysQueryValidator` here
});
