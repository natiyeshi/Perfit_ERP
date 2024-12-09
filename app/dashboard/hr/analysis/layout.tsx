import CustomLink from "@/components/custom/CustomLink";
import Link from "next/link";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <div className="w-full overflow-auto max-h-screen">
        <div className="w-full flex flex-col h-full">
          <div className="flex w-full h-12 border-b"></div>
          <div className="flex-1 overflow-auto flex w-full">
            <div className="flex-1 ">{children}</div>
            <div className="w-52 border-l px-3 pt-5 flex flex-col gap-2">
              <div className="text-white text-lg">Analysis</div>
              <CustomLink
                link={"/dashboard/hr/analysis/gender"}
                name="Gender"
              />
              <CustomLink
                link={"/dashboard/hr/analysis/status"}
                name="status"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
