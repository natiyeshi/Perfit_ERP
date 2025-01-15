import CustomerTable from "./_components/CustomerTable";
const page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1  flex flex-col">
      <CustomerTable />
    </div>
  );
};

export default page;
