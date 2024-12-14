import CustomLink from "@/components/custom/CustomLink";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <div className="w-[300px] ml-[80px] border-r">
        <div className="h-12 ps-4 text-white border-b capitalize text-lg flex">
          <div className="my-auto">Human Resource</div>
        </div>
        <div className="flex flex-col gap-2 mt-5 ps-4">
          <CustomLink link={"/dashboard/hr/employees"} name="Employee" />
          <div className="py-1 px-2 hover:bg-zinc-800 rounded mx-2 duration-200">
            Track Attendance
          </div>
          <div className="py-1 px-2 hover:bg-zinc-800 rounded mx-2 duration-200">
            Payroll
          </div>
          <CustomLink link={"/dashboard/hr/analysis"} name="Analysis" />
        </div>
      </div>
      {children}
    </>
  );
}
