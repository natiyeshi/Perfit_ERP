export interface IProduct {
    name: string;
    unitPrice: number;
    shelfLife?: string;
    brand?: string;
}
  
export interface IDBProduct extends IProduct {
    id: string;
}
  
  
  
  