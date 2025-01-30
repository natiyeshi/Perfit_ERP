"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Addcompetitor from "@/components/custom/competitor/AddCompetitor";
import { Button } from "@/components/ui/button";
import { useCompetitorTable } from "../hook/useCompetitorTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
import DeleteCompetitor from "@/components/custom/competitor/DeleteCompetitor";
import UpdateCompetitor from "@/components/custom/competitor/UpdateCompetitor";
import { IDBCompetitor } from "@/types/ICompetitor";
import CustomeTable from "@/components/custom/table/CustomeTable";
const CompetitorTable: React.FC = () => {
  const headers: { name: string; key: keyof IDBCompetitor }[] = [
    { name: "Name", key: "name" },
    { name: "Email", key: "email" },
    { name: "Phone Number", key: "phoneNumber" },
    { name: "Country", key: "country" },
  ];
  const { filters, competitors, setFilters, filter, reload, query } =
    useCompetitorTable();
  return (
    <>
      <div className="w-full py-4 px-2 flex justify-between">
        <div className="w-[400px]">
          <Input
            placeholder="search"
            value={filters.name}
            onChange={({ target }) =>
              filter("name", target.value.toLowerCase())
            }
            className="py-0"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Button
            onClick={reload}
            disabled={query.isFetching}
            variant="outline"
            className="px-2 rounded-full"
          >
            <IoMdRefresh className="text-xl" />
          </Button>
          <Addcompetitor />
          {/* <FilterCard setFilters={setFilters} filter={filters} /> */}
        </div>
      </div>
      <div className="py-2 px-2 flex flex-wrap gap-3">
        {Object.entries(filters).map(
          ([key, value]) =>
            value && (
              <div
                key={key}
                className="flex bg-green-600 text-white items-center w-fit gap-1 py-1 px-2 rounded-lg"
              >
                <div>{value}</div>
                <IoCloseSharp
                  onClick={() => filter(key, key === "name" ? "" : null)}
                  className="text-lg hover:bg-gray-200/20 rounded-full cursor-pointer"
                />
              </div>
            )
        )}
      </div>
      <div className="overflow-scroll flex-1">
        <CustomeTable
          query={query}
          headers={headers}
          result={competitors}
          DeleteItem={DeleteCompetitor}
          UpdateItem={UpdateCompetitor}
        />
      </div>
    </>
  );
};

export default CompetitorTable;
