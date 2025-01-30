"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFilter, FaProductHunt } from "react-icons/fa";
import AddProduct from "./AddProduct";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { usePathname } from "next/navigation";

const ProductMenu = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const isActive = pathname == "/dashboard/" + user.role + "/products";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          role="button"
          className={`flex gap-2 items-center px-2 rounded ${isActive && "text-primary"}`}
        >
          <FaProductHunt className="text-xl" />
          <div>Products</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Product</h4>
            <p className="text-sm text-muted-foreground">Your Products Here!</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/dashboard/${user.role}/products`}>
              <Button variant={"outline"} className="w-full">
                See Products
              </Button>
            </Link>
            {/* <Button variant={"outline"} className="w-full">
              Add Product
            </Button> */}
            <AddProduct />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductMenu;
