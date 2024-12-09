import { IDBEmployee } from "@/types/IEmployee";
import { PostgrestError } from "@supabase/supabase-js";


export type SupabaseQueryResult<T> = Promise<{
    data: T[] | null;
    error: PostgrestError | null;
  }>;

export type SupabaseCreateResult<T> = Promise<{
    data: T | null;
    error: PostgrestError | null;
  }>;

export type EmployeeQueryResult = SupabaseQueryResult<IDBEmployee>;
export type EmployeeCreateResult = SupabaseQueryResult<IDBEmployee>;