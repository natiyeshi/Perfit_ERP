import { redirect } from "next/navigation";
import data from "@/data/empdata";
import ImportTable from "./_components/ImportTable";
const page = () => {
  // redirect("/dashboard/hr/employees");
  return (
    <div className="overflow-y-auto w-full h-full flex-1   flex flex-col">
      <ImportTable />
    </div>
  );
};

export default page;
