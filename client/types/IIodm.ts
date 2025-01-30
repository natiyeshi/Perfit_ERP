import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IIodm {
    expiryDate: string; // Must be a valid date
    manufactureDate: string; // Must be a valid date
    purchasePriceUsd: number; // Must be a positive number
    currentSellingPrice: number; // Must be a positive number
    productMovement: "HIGH" | "LOW" | "MEDIUM"; // Enum with specific values
    transportCost: number; // Must be a non-negative number
    grossWeight: number; // Must be a positive number
    cbm: number; // Must be a positive number
    freightCost: number; // Must be a non-negative number
    dutyTax: number; // Must be a non-negative number
    bsc: number; // Must be a non-negative number
    shipmentAmount: number; // Must be a non-negative number
    insuranceCharge: number; // Must be a non-negative number
    loadingUnloading: number; // Must be a non-negative number
    exchangeRate: number; // Must be a positive number
    supplierId: string; // Must be a non-empty string
    productId: string; // Must be a non-empty string
  }
  
  export interface IDBIodm extends IIodm {
    id : string;
    }
  
    
    
export interface IDBPopulatedIODM extends IDBIodm {
  product : IDBProduct;
  supplier : IDBSupplier;
}


export interface IDBClientIIodm extends IDBPopulatedIODM {
  productName? : string;
  supplierName? : string;
  totalPrice? : number,
}