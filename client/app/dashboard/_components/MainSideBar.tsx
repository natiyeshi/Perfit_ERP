"use client";
import Link from "next/link";
import { FaPeopleArrows } from "react-icons/fa";
import { LuImport } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { usePathname } from "next/navigation";

interface MainLinkInf {
  name: string;
  Icon: any;
  link: string;
}

const sideLinks: MainLinkInf[] = [
  {
    name: "Import Data",
    Icon: LuImport,
    link: "/dashboard/import",
  },
  {
    name: "Inventory",
    Icon: MdOutlineInventory2,
    link: "/dashboard/inventory",
  },
];

const MainSideBar = () => {
  return (
    <div className="w-20 absolute group pb-12 hover:w-[240px] duration-300 border-r bg-background  min-h-screen overflow-y-auto overflow-x-hidden ">
      <div className="py-3  w-full">
        <div className="w-[80px] text-center capitalize font-semibold">D</div>
      </div>
      <div className="flex flex-col gap-3 px-2 pt-2">
        {sideLinks.map((link, key) => (
          <SideBarLink key={key} link={link} />
        ))}
      </div>
    </div>
  );
};

const SideBarLink = ({ link }: { link: MainLinkInf }) => {
  const Icon = link.Icon;
  const pathname = usePathname();
  const isActive = pathname.includes(link.link);

  return (
    <Link href={link.link} className=" ">
      <div
        className={`flex gap-1  items-center  py-1 hover:bg-zinc-800 rounded ${isActive && "bg-zinc-800"} `}
      >
        <div className="min-w-[60px] py-2 px-1  flex ">
          <Icon className="text-xl text-gray-300 mx-auto" />
        </div>
        <div className="group-hover:flex hidden group-hover:min-w-fit  group-hover:flex-nowrap group-hover:overflow-hidden whitespace-nowrap text-clip">
          {link.name}
        </div>
      </div>
    </Link>
  );
};

export default MainSideBar;
