export interface IProduct {
    name: string;
    unitPrice: number;
    shelfLife: number;
    brand?: string;
}
  
export interface IDBProduct extends IProduct {
    id: string;
}
  
  
  
  