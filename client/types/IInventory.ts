import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IInventory {
    productId: string;
    quantity: number;
    unitPrice?: number;
}
  
  export interface IDBInventory extends IInventory {
    id : string;
  }
  
  export interface IDBPopulatedInventory extends IDBInventory {
    product : IDBProduct;
  }
  
  
  export interface IDBClientInventory extends IDBPopulatedInventory {
    productName? : string;
  }