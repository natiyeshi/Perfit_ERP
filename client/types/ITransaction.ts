import { IDBCompetitor } from "./ICompetitor";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface ITransaction {
    unitPrice: number;
    quantity: number;
    productId: string;
    customerId: string;
    salesPersonId: string;
}

export interface IDBTransaction extends ITransaction {
  id : string;
}

export interface IDBPopulatedITransaction extends IDBTransaction {
  product : IDBProduct;
  competitor : IDBCompetitor;
  supplier : IDBSupplier;
}


export interface IDBClientITransaction extends IDBPopulatedITransaction {
  productName? : string;
  competitorName? : string;
  supplierName? : string;
  unit? : string,
  shelfLife? : number,
  totalPrice? : number,
}