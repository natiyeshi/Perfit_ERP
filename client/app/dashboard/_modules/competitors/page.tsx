"use client"
import CompetitorTable from "./_components/CompetitorTable";
const page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1  flex flex-col">
      <CompetitorTable />
    </div>
  );
};

export default page;
