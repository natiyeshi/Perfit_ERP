import ErrorMessage from "@/components/custom/ErrorMessage";
import EmployeeTable from "../../_components/EmployeeTable";
import { getEmployees } from "../_actions/employee";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const supabase = await createClient();
  let { data: Employees, error } = await supabase.from("Employee").select("*");

  return (
    <>
      <div className={`w-full ${!error && "overflow-auto"} max-h-screen`}>
        <div className="w-full flex flex-col h-full">
          <div className="flex w-full h-12 border-b"></div>
          <div className=" overflow-y-auto w-full h-full flex-1  flex flex-col">
            <div></div>
            {error ? (
              <ErrorMessage message={error.message} topic="Sorry" />
            ) : (
              <EmployeeTable mainData={Employees ?? []} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
