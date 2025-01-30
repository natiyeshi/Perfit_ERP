"use client";
import Link from "next/link";
import Image from "next/image";
import { FaPeopleArrows } from "react-icons/fa";
import { LuImport } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { PiMatrixLogoFill } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import logo from "@/public/assets/logo/icon.svg";
import { roleInf, useUser } from "@/context/userContext";

interface MainLinkInf {
  name: string;
  Icon: any;
  link: string;
  mainLink?: string;
}

const adminLinks: MainLinkInf[] = [
  {
    name: "Import Data",
    Icon: LuImport,
    link: "/dashboard/admin/import/report",
    mainLink: "/dashboard/admin/import",
  },
  {
    name: "Inventory",
    Icon: MdOutlineInventory2,
    link: "/dashboard/admin/inventory",
  },

  {
    name: "CRM",
    Icon: FaPersonCircleCheck,
    link: "/dashboard/admin/crm",
  },

  {
    name: "IODM",
    Icon: PiMatrixLogoFill,
    link: "/dashboard/admin/iodm",
  },
];
const sellsLinks: MainLinkInf[] = [
  {
    name: "Inventory",
    Icon: MdOutlineInventory2,
    link: "/dashboard/sales/inventory",
  },

  {
    name: "CRM",
    Icon: FaPersonCircleCheck,
    link: "/dashboard/sales/crm",
  },
];
const aggregatorLinks: MainLinkInf[] = [
  {
    name: "Import Data",
    Icon: LuImport,
    link: "/dashboard/feeder/import",
  },
];

const sideLinks: any = {
  admin: adminLinks,
  sales: sellsLinks,
  feeder: aggregatorLinks,
  any: [],
};
const MainSideBar = () => {
  const { user } = useUser();
  const roles = new Set(["admin", "sales", "feeder"]);
  const role: any = roles.has(user.role) ? user.role : "any";
  return (
    <div className="w-20 absolute  group pb-6 hover:w-[240px] duration-300 border-r bg-[#2B8890] text-white min-h-screen flex flex-col overflow-y-auto overflow-x-hidden ">
      <div className="w-full h-12 min-h-12 max-h-12  flex">
        <div className="m-auto text-center  capitalize font-semibold bg-white rounded-full p-1">
          <Image className="w-[25px]" src={logo} alt="Logo" />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-2 pt-2  h-full flex-1">
        {sideLinks[role].map((link: MainLinkInf, key: number) => (
          <SideBarLink key={key} link={link} />
        ))}
      </div>
      {role == "admin" && <SettingSideBarLink />}
    </div>
  );
};

const SideBarLink = ({ link }: { link: MainLinkInf }) => {
  const Icon = link.Icon;
  const pathname = usePathname();
  const isActive = pathname.includes(link.mainLink ? link.mainLink : link.link);

  return (
    <Link href={link.link} className=" ">
      <div
        className={`flex gap-1  items-center  py-1  rounded ${isActive ? "bg-primary text-white" : "hover:bg-primary"} `}
      >
        <div className="min-w-[60px] py-2 px-1  flex ">
          <Icon
            className={`text-xl ${isActive ? "text-background" : "text-background"}  mx-auto`}
          />
        </div>
        <div className="group-hover:flex hidden group-hover:min-w-fit  group-hover:flex-nowrap group-hover:overflow-hidden whitespace-nowrap text-clip">
          {link.name}
        </div>
      </div>
    </Link>
  );
};

const SettingSideBarLink = () => {
  const { user } = useUser();
  const link = {
    Icon: CiSettings,
    link: `/dashboard/${user.role}/settings`,
  };
  const Icon = link.Icon;
  const pathname = usePathname();
  const isActive = pathname.includes(link.link);

  return (
    <Link href={link.link} className="w-fit mt-auto px-2 pt-2">
      <div
        className={`flex gap-1  items-center  py-1 hover:bg-primary rounded  ${isActive ? "bg-primary text-white" : "hover:bg-secondary/50"} `}
      >
        <div className="min-w-[60px] py-2 px-1  flex ">
          <Icon
            className={`text-xl  ${isActive ? "text-background" : "text-background"} mx-auto`}
          />
        </div>
      </div>
    </Link>
  );
};

export default MainSideBar;
