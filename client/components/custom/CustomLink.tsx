"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface CustomComponentProps {
  link: string;
  name: string;
  base?: boolean;
}

const CustomLink: React.FC<CustomComponentProps> = ({ link, name,base = false }) => {
  const pathname = usePathname();

  const isActive = base || name == "data" ? pathname == link : pathname.includes(link);

  return (
    <Link
      href={link}
      className={`capitalize py-1 px-2  ${isActive ? "bg-primary text-white" : "hover:bg-primary/40"} rounded mx-2 duration-200`}
    >
      {name}
    </Link>
  );
};

export default CustomLink;
