import { redirect } from "next/navigation";
import InventoryTable from "./_components/InventoryTable";

const page = () => {
  // redirect("/dashboard/admin/hr/employees");
  return (
    <>
      <InventoryTable />
    </>
  );
};

export default page;
