import { redirect } from "next/navigation";

const page = () => {
  redirect("/dashboard/import");
  // return <>Some content here</>;
};

export default page;
