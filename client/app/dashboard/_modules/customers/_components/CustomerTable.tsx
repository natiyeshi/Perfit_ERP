"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Addcustomer from "@/components/custom/customer/AddCustomer";
import { Button } from "@/components/ui/button";
import { useCustomerTable } from "../hook/useCustomerTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
import DeleteCustomer from "@/components/custom/customer/DeleteCustomer";
import UpdateCustomer from "@/components/custom/customer/UpdateCustomer";
import { IDBCustomer } from "@/types/ICustomer";
import CustomeTable from "@/components/custom/table/CustomeTable";
const CustomerTable: React.FC = () => {
  const headers: { name: string; key: keyof IDBCustomer }[] = [
    { name: "Organization Name", key: "organizationName" },
    { name: "City", key: "city" },
    { name: "Catagory", key: "catagory" },
    { name: "Phone Number", key: "phoneNumber" },
  ];
  const { filters, customers, setFilters, filter, reload, query } =
    useCustomerTable();
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
          <Addcustomer />
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
          result={customers}
          DeleteItem={DeleteCustomer}
          UpdateItem={UpdateCustomer}
        />
      </div>
    </>
  );
};

export default CustomerTable;
