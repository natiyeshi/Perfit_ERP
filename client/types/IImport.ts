import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface IImport {
  unitPrice: number;
  quantity: number;
  manufacturerDate: string;
  expiryDate: string;
  modeOfShipment?: string;
  productId: string;
  supplierId: string;
  competitorId: string;
}

export interface IDBImport extends IImport {
  id : string;
  createdAt : string;
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
  totalPrice? : number,
}