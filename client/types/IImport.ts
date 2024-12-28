import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IImport {
  quantity: number;
  unitPrice: number;
  orderDate?: string;
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
  unit? : string,
  shelfLife? : number,
  totalPrice? : number,
}