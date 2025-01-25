"use client"

import TransactionTable from "./_components/TransactionTable";
const page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1   flex flex-col">
      <TransactionTable />
    </div>
  );
};

export default page;
