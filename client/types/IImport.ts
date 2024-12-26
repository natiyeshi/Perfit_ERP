import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IImport {
  quantity: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  orderDate?: string;
  shelfLife?: number;
  modeOfShipment?: string;
  productId: string;
  supplierId: string;
  competitorId: string;
}

export interface IDBImport extends IImport {
  id : string;
}

export interface IDBPopulatedImport extends IDBImport {
  product : IDBProduct;
  competitor : IDBCompetitor;
  supplier : IDBSupplier;
}


export interface IDBClientImport extends IDBPopulatedImport {
  productName? : string;
  competitorName? : string;
  supplierName? : string;
}