"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaFilter } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopImportProductsFilterState } from "./TopImported";

const Filter = ({
  filter,
  setFilter,
}: {
  filter: TopImportProductsFilterState;
  setFilter: Function;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FaFilter className="" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set Your Filters Here.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div>Time Period</div>
            <Select
              value={filter.time}
              onValueChange={(value: string) =>
                setFilter({ ...filter, time: value as TopImportProductsFilterState["time"] })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="last month">Last Month</SelectItem>
                <SelectItem value="last 3 months">Last 3 Months</SelectItem>
                <SelectItem value="last 6 months">Last 6 Months</SelectItem>
                <SelectItem value="this 12 months">This 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
