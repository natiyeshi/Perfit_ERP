export interface IProduct {
    name: string;
    batch: string;
    brand: string;
    unit: string;
}
  
export interface IDBProduct extends IProduct {
    id: string;
}
  
  
  
  