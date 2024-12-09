import { createClient } from "@/utils/supabase/client";
import { EmployeeCreateResult, EmployeeQueryResult } from "@/types/main_type";
import { IEmployee } from "@/types/IEmployee";

export const getEmployees = async (): Promise<EmployeeQueryResult> => {
  const supabase = createClient();
  return await supabase.from("Employee").select("*");
};

export const createEmployee = async (
  employee: IEmployee
): Promise<EmployeeCreateResult> => {
  const supabase = createClient();
  return await supabase.from("Employee").insert([employee]).select();
};
