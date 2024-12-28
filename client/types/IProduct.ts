export interface IProduct {
    name: string;
    shelfLife: number;
    brand: string;
    unit: string;
}
  
export interface IDBProduct extends IProduct {
    id: string;
}
  
  
  
  