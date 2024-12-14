import { redirect } from "next/navigation";

const page = () => {
  redirect("/dashboard/hr/employees");
};

export default page;
