export interface ICustomer {
  organizationName: string;
  phoneNumber: string;
  city: string;
  catagory?: string;
}
export interface IDBCustomer extends ICustomer {
  id: string; 
}
  

