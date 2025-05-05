// export interface CostBuildUp {
//     id: number;
//     fobPriceUSD: number;
//     exchangeRate: number;
//     totalFobCostBirr: number;
//     fcPurchase: number;
//     bankServiceCharges: number;
//     insuranceCharge: number;
//     seaFreightCharge: number;
//     customsDuty: number;
//     storageCharges: number;
//     inlandTransport: number;
//     transitAgentCharge: number;
//     loadingUnloadingExpenses: number;
//     totalCost: number;
//     createdAt: Date;
//     updatedAt: Date;
//   }
  
import { z } from 'zod';

export const CreateCostBuildUpSchema = z.object({
  fobPriceUSD: z.number(),
  exchangeRate: z.number(),
  // totalFobCostBirr: z.number(), fobpriceUSD * exchangeRate
  // fcPurchase: z.number(),
  bankServiceCharges: z.number(),
  insuranceCharge: z.number(),
  seaFreightCharge: z.number(),
  customsDuty: z.number(),
  storageCharges: z.number(),
  inlandTransport: z.number(),
  transitAgentCharge: z.number(),
  loadingUnloadingExpenses: z.number(),
  usdPurchasePrice : z.number()
,  // totalCost: z.number(),
});
