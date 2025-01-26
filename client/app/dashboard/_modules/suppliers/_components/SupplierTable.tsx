"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Addsupplier from "@/components/custom/supplier/AddSupplier";
import { Button } from "@/components/ui/button";
import { useSupplierTable } from "../hook/useSupplierTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
import DeleteSupplier from "@/components/custom/supplier/DeleteSupplier";
import UpdateSupplier from "@/components/custom/supplier/UpdateSupplier";
import { IDBClientSupplier, IDBSupplier } from "@/types/ISupplier";
import CustomeTable from "@/components/custom/table/CustomeTable";
const SupplierTable: React.FC = () => {
  const headers: {
    name: string;
    key: keyof IDBClientSupplier;
    showDetail?: keyof IDBClientSupplier;
  }[] = [
    { name: "Manufacturer Name", key: "manufacturerName" },
    { name: "Email", key: "email" },
    { name: "Country", key: "country" },
    { name: "Phone Number", key: "phoneNumber" },
    {
      name: "Product Imports",
      key: "productName",
      showDetail: "clientDeliverableProducts",
    },
  ];
  const { filters, suppliers, setFilters, filter, reload, query } =
    useSupplierTable();
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
          <Addsupplier />
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
          result={suppliers}
          DeleteItem={DeleteSupplier}
          UpdateItem={UpdateSupplier}
        />
      </div>
    </>
  );
};

export default SupplierTable;
