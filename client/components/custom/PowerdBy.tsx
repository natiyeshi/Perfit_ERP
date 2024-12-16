import Image from "next/image";
import logo from "@/public/assets/logo/logo-1.svg";

export default function PowerdBy({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1 items-center ${className}`}>
      <Image className="w-[20px]" src={logo} alt="Logo" />
      <div className="text-sm text-gray-300">Powerd by Dama Solutions!</div>
    </div>
  );
}
