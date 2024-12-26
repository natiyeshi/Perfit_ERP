import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IInventory {
    productId: string;
    supplierId: string;
    quantity: number;
    unit?: string;
    unitPrice?: number;
    totalPrice?: number;
    orderDate?: string;
    shelfLife: number;
    modeOfShipment?: string;
}
  
  export interface IDBInventory extends IInventory {
    id : string;
  }
  
  export interface IDBPopulatedInventory extends IDBInventory {
    product : IDBProduct;
    supplier : IDBSupplier;
  }
  
  
  export interface IDBClientInventory extends IDBPopulatedInventory {
    productName? : string;
    supplierName? : string;
  }