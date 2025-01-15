export interface ISupplier {
  manufacturerName: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  productIDs?: string[];
}

export interface IDBSupplier extends ISupplier {
  id: string;
}
