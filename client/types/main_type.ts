import { IDBEmployee } from "@/types/IEmployee";


export type SupabaseQueryResult<T> = Promise<{
    data: T[] | null;
    error: null;
  }>;

export type SupabaseCreateResult<T> = Promise<{
    data: T | null;
    error: null;
  }>;

export type EmployeeQueryResult = SupabaseQueryResult<IDBEmployee>;
export type EmployeeCreateResult = SupabaseQueryResult<IDBEmployee>;