export interface ICustomer {
    fullName: string; // Required for createCustomerSchema, optional for updateCustomerSchema
    label?: string;   // Optional for updateCustomerSchema
  }
export interface IDBCustomer extends ICustomer {
  id: string; 
}
  