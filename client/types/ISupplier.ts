import { IDBProduct } from "./IProduct";

export interface ISupplier {
  manufacturerName: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  productIDs?: string[];
  deliverableProducts?:IDBProduct[];

}

export interface IDBSupplier extends ISupplier {
  id: string;
}


export interface IDBPopulatedSupplier extends IDBSupplier {
  deliverableProducts?:IDBProduct[];
}


export interface IDBClientSupplier extends IDBPopulatedSupplier {
  productName? : string;
  clientDeliverableProducts? : string[]
}