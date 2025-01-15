import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoPersonSharp } from "react-icons/io5";
import AddCustomer from "./AddCustomer";
import Link from "next/link";

const CustomerMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div role="button" className="flex gap-2 items-center px-2 rounded">
          <IoPersonSharp className="text-xl" />
          <div>Customers</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Customer</h4>
            <p className="text-sm text-muted-foreground">
              Your Customers Here!
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/admin/customers">
              <Button variant={"outline"} className="w-full">
                See Customers
              </Button>
            </Link>
            <AddCustomer />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerMenu;
