
enum ROLE {
    UNKNOWN,
    DATA_AGGREGATOR,
    SALES_PERSON,
    ADMIN,
}

  
export interface IUser{
    id: string,
    fullName: string,
    email: string,
    role: ROLE,
    salesPerson: null,
    flag: {
      userId: string,
      isSuspended: boolean,
    }
}