import { redirect } from "next/navigation";
import MostSold from "./_components/Sold/MostSold";

const page = () => {
  return (
    <div className="px-6 flex-1 overflow-auto">
      <MostSold />
    </div>
  );
};

export default page;
