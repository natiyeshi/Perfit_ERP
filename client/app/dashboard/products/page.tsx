import { redirect } from "next/navigation";
import data from "@/data/empdata";
import ProductTable from "./_components/ProductTable";
const page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1  flex flex-col">
      <ProductTable />
    </div>
  );
};

export default page;
