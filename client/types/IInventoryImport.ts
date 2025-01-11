
import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IInventoryImport {
  unitPrice: number;
  quantity: number;
  manufacturerDate: string;
  expiryDate: string;
  modeOfShipment?: string;
  productId: string;
  supplierId: string;
}

export interface IDBInventoryImport extends IInventoryImport {
  id : string;
}

export interface IDBPopulatedInventoryImport extends IDBInventoryImport {
  product : IDBProduct;
  supplier : IDBSupplier;
}


export interface IDBClientInventoryImport extends IDBPopulatedInventoryImport {
  productName? : string;
  supplierName? : string;
  unit? : string,
  shelfLife? : number,
  totalPrice? : number,
}