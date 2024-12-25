export interface ISupplier {
  name?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
}

export interface IDBSupplier extends ISupplier {
  id: string;
}
