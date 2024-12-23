export interface ISupplier {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
}

export interface IDBSupplier extends ISupplier {
  id: string;
}
