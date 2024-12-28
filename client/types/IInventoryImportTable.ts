
import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IInventoryImport {
    unitPrice: number;
    quantity: number;
    orderDate: string;
    modeOfShipment?: string;
    productId: string;
    supplierId: string;
    competitorId: string;
}

export interface IDBInventoryImport extends IInventoryImport {
  id : string;
}

export interface IDBPopulatedInventoryImport extends IDBInventoryImport {
  product : IDBProduct;
  competitor : IDBCompetitor;
  supplier : IDBSupplier;
}


export interface IDBClientInventoryImport extends IDBPopulatedInventoryImport {
  productName? : string;
  competitorName? : string;
  supplierName? : string;
  unit? : string,
  shelfLife? : number,
  totalPrice? : number,
}