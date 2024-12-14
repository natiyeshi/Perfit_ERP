import { redirect } from "next/navigation";

const page = () => {
  redirect("/dashboard/hr/analysis/gender");
};

export default page;
