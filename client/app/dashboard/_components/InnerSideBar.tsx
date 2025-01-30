"use client";
import CompetitorMenu from "@/components/custom/competitor/CompetitorMenu";
import CustomerMenu from "@/components/custom/customer/CustomerMenu";
import CustomLink from "@/components/custom/CustomLink";
import Nav from "@/components/custom/Nav";
import ProductMenu from "@/components/custom/product/ProductMenu";
import SupplierMenu from "@/components/custom/supplier/SupplierMenu";
import Cookies from "js-cookie";
import { IoNotifications } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LinkInf {
  name: string;
  link: string;
  Icon?: any;
  base?: boolean;
}

export interface InnerSideBarInf {
  name: string;
  links: LinkInf[];
}

const InnerSideBar = ({
  children,
  data,
}: {
  children: any;
  data: InnerSideBarInf;
}) => {
  return (
    <>
      <div className="min-w-[230px]  ml-[80px] border-r">
        <div className="h-12 min-h-12 max-h-12 ps-4 text-foreground border-b capitalize text-lg flex">
          <div className="my-auto">{data.name}</div>
        </div>
        <div className="flex flex-col gap-2 mt-5 ps-4">
          {data.links.map((singleLink, ind) => (
            <CustomLink
              base={singleLink.base}
              key={ind}
              link={singleLink.link}
              name={singleLink.name}
            />
          ))}
        </div>
      </div>
      <div
        className={`w-full max-h-screen flex-1 overflow-x-hidden overflow-y-auto`}
      >
        <div className="w-full flex flex-col  h-full">
          <div className="flex w-full h-12 min-h-12 max-h-12 border-b">
            <div className="mx-auto flex gap-4 my-auto pe-4">
              <ProductMenu />
              <CustomerMenu />
              <SupplierMenu />
              <CompetitorMenu />
            </div>
            <div className="pe-4 flex gap-3">
              <Notifications />
              <Profile />
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

const Profile = () => {
  const handleLogout = () => {
    Cookies.remove("token");
    if (typeof location !== "undefined") location.href = "/sign-in";
  };
  return (
    <Popover>
      <PopoverTrigger className="my-auto me-4">
        <div className="bg-foreground w-8 h-8 rounded-full text-background font-black  flex ">
          <div className="m-auto">N</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="shadow shadow-gray-500 w-32 me-4">
        <div className="flex flex-col ">
          <Button className="w-fit" variant="link">
            <Link href="/dashboard/admin/settings">Settings</Link>
          </Button>
          <Button onClick={handleLogout} className="w-fit" variant="link">
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Notifications = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="bg-foreground w-8 h-8 rounded-full text-background font-black  flex ">
          <IoNotifications className="m-auto" />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription className="mt-4 flex flex-col gap-2">
            <Noti />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const Noti = () => {
  return (
    <div className="w-full flex flex-col text-sm rounded border gap-1 p-2 text-gray-800">
      <div className="font-semibold">Welcome</div>
      <div className="text-xs">Welcome To out Platform</div>
    </div>
  );
};

export default InnerSideBar;
