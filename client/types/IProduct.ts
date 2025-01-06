export interface IProduct {
    name: string;
    batch: number;
    brand: string;
    unit: string;
}
  
export interface IDBProduct extends IProduct {
    id: string;
}
  
  
  
  