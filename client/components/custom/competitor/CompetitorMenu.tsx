import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoPersonSharp } from "react-icons/io5";
import AddCompetitor from "./AddCompetitor";
import Link from "next/link";

const CompetitorMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div role="button" className="flex gap-2 items-center px-2 rounded">
          <IoPersonSharp className="text-xl" />
          <div>Competitors</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Competitor</h4>
            <p className="text-sm text-muted-foreground">
              Your Competitors Here!
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/competitors">
              <Button variant={"outline"} className="w-full">
                See Competitors
              </Button>
            </Link>
            <AddCompetitor />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompetitorMenu;
