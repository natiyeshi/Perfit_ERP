"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface CustomComponentProps {
  link: string;
  name: string;
}

const CustomLink: React.FC<CustomComponentProps> = ({ link, name }) => {
  const pathname = usePathname();

  const isActive = pathname.includes(link);

  return (
    <Link
      href={link}
      className={`capitalize py-1 px-2 hover:bg-zinc-800 ${isActive && "bg-zinc-800"} rounded mx-2 duration-200`}
    >
      {name}
    </Link>
  );
};

export default CustomLink;
