import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFilter } from "react-icons/fa";
export interface filterInf {
  name: string;
  gender?: "Male" | "Female" | null;
  age?: number | null;
  status?: "Inactive" | "Active" | null;
}

const FilterCard = ({
  setFilters,
  filter,
}: {
  setFilters: Function;
  filter: filterInf;
}) => {
  const setGender = (value: string | null) => {
    setFilters((da: any) => ({ ...da, gender: value }));
  };
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
          <div className="flex flex-col gap-2">
            <div>Gender</div>
            <div className="flex gap-2">
              <Button
                className="py-1"
                variant={filter.gender != "Male" ? "outline" : "default"}
                onClick={() => setGender("Male")}
              >
                Male
              </Button>
              <Button
                variant={filter.gender != "Female" ? "outline" : "default"}
                onClick={() => setGender("Female")}
              >
                Femal
              </Button>
              {filter.gender != null && (
                <Button variant={"destructive"} onClick={() => setGender(null)}>
                  Clear
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div>Status</div>
              <div className="flex gap-2">
                <Button
                  className="py-1"
                  variant={filter.status != "Active" ? "outline" : "default"}
                  onClick={() =>
                    setFilters((f: any) => ({ ...f, status: "Active" }))
                  }
                >
                  Active
                </Button>
                <Button
                  variant={filter.status != "Inactive" ? "outline" : "default"}
                  onClick={() =>
                    setFilters((f: any) => ({ ...f, status: "Inactive" }))
                  }
                >
                  Inactive
                </Button>
                {filter.status != null && (
                  <Button
                    variant={"destructive"}
                    onClick={() =>
                      setFilters((f: any) => ({ ...f, status: null }))
                    }
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterCard;
