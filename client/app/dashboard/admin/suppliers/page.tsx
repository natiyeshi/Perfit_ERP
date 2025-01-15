import { redirect } from "next/navigation";
import data from "@/data/empdata";
import SupplierTable from "./_components/SupplierTable";
const page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1  flex flex-col">
      <SupplierTable />
    </div>
  );
};

export default page;
