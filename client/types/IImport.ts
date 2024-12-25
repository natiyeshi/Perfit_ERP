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