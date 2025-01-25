import { IDBCompetitor } from "./ICompetitor";
import { IDBCustomer } from "./ICustomer";
import { IDBProduct } from "./IProduct";
import { IDBSupplier } from "./ISupplier";

export interface ITransaction {
  unitPrice: number;
  quantity: number;
  productId: string;
  customerId: string;
  importId: string;
}

export interface IDBTransaction extends ITransaction {
  id : string;
}

export interface IDBPopulatedTransaction extends IDBTransaction {
  product : IDBProduct;
  customer : IDBCustomer;
  import : IDBSupplier;
}


export interface IDBClientTransaction extends IDBPopulatedTransaction {
  productName? : string;
  customerName? : string;
  totalPrice? : number,
}