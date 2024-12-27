
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
    role: "UNKNOWN" | "DATA_AGGREGATOR" | "SALES_PERSON" | "ADMIN",
    salesPerson: null,
    flag: {
      userId: string,
      isSuspended: boolean,
    }
}