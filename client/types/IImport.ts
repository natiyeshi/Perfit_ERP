export interface IImport {
    quantity: number; // Required for create schema
    unit?: string; // Optional
    unitPrice?: number; // Optional
    totalPrice?: number; // Optional
    orderDate?: string; // Optional
    shelfLife?: string; // Optional
    modeOfShipment?: string; // Optional
    productId: string; // Required and must be a valid UUID
    supplierId: string; // Required and must be a valid UUID
    competiatorId: string; // Required and must be a valid UUID
  }
  
  
export interface IDBImport extends IImport {
    id : string,
}