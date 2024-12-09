import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DataTable from "datatables.net-dt";
import MainSideBar from "./_components/ManSideBar";

export default async function Layout({ children }: { children: any }) {
  // const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }

  return (
    <main className="w-full min-h-screen flex text-sm text-gray-400 bg-background">
      <MainSideBar />
      <>{children}</>
    </main>
  );
}
