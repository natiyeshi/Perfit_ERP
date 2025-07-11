import { z } from 'zod';

export const CreateCostBuildUpProductSchema = z.object({
  productId: z.string({
    required_error: "Product ID is required",
    invalid_type_error: "Product ID must be a string",
  }),
  unitPrice: z.number({
    required_error: "Unit price is required",
    invalid_type_error: "Unit price must be a number",
  }),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  }),
  competitorSellingPrice: z.number({
    required_error: "Competitor selling price is required",
    invalid_type_error: "Competitor selling price must be a number",
  }),
  sellingPrice: z.number({
    invalid_type_error: "Selling price must be a number",
  }).optional(),
});

export const CreateCostBuildUpSchema = z.object({
  fobPriceUSD: z.number({
    required_error: "FOB price (USD) is required",
    invalid_type_error: "FOB price (USD) must be a number",
  }),
  exchangeRate: z.number({
    required_error: "Exchange rate is required",
    invalid_type_error: "Exchange rate must be a number",
  }),
  totalFobCostBirr: z.number({
    required_error: "Total FOB cost (Birr) is required",
    invalid_type_error: "Total FOB cost (Birr) must be a number",
  }),
  fcPurchase: z.number({
    required_error: "FC purchase is required",
    invalid_type_error: "FC purchase must be a number",
  }),
  bankServiceCharges: z.number({
    required_error: "Bank service charges are required",
    invalid_type_error: "Bank service charges must be a number",
  }),
  insuranceCharge: z.number({
    required_error: "Insurance charge is required",
    invalid_type_error: "Insurance charge must be a number",
  }),
  freightCharge: z.number({
    required_error: "Freight charge is required",
    invalid_type_error: "Freight charge must be a number",
  }),
  customsDuty: z.number({
    required_error: "Customs duty is required",
    invalid_type_error: "Customs duty must be a number",
  }),
  storageCharges: z.number({
    required_error: "Storage charges are required",
    invalid_type_error: "Storage charges must be a number",
  }),
  inlandTransport: z.number({
    required_error: "Inland transport is required",
    invalid_type_error: "Inland transport must be a number",
  }),
  transitAgentCharge: z.number({
    required_error: "Transit agent charge is required",
    invalid_type_error: "Transit agent charge must be a number",
  }),
  loadingUnloadingExpenses: z.number({
    required_error: "Loading/unloading expenses are required",
    invalid_type_error: "Loading/unloading expenses must be a number",
  }),
  totalCost: z.number({
    required_error: "Total cost is required",
    invalid_type_error: "Total cost must be a number",
  }),
  usdPurchasePrice: z.number({
    required_error: "USD purchase price is required",
    invalid_type_error: "USD purchase price must be a number",
  }),
  mislaneousCost: z.number({
    invalid_type_error: "Miscellaneous cost must be a number",
  }).optional().default(0),

  CostBuildUpProducts : z.array(CreateCostBuildUpProductSchema).optional().default([]),

});