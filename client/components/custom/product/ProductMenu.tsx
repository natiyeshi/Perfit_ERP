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

const ProductMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div role="button" className="flex gap-2 items-center px-2 rounded">
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
            <Link href="/dashboard/admin/products">
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
