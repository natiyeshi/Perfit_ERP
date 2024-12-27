"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Addproduct from "@/components/custom/product/AddProduct";
import { Button } from "@/components/ui/button";
import { useProductTable } from "../hook/useProductTable";
import FilterCard from "./Filter";
import { IoMdRefresh } from "react-icons/io";
import DeleteProduct from "@/components/custom/product/DeleteProduct";
import UpdateProduct from "@/components/custom/product/UpdateProduct";
import { IDBProduct } from "@/types/IProduct";
import CustomeTable from "@/components/custom/table/CustomeTable";
const ProductTable: React.FC = () => {
  const headers: { name: string; key: keyof IDBProduct }[] = [
    { name: "Product Name", key: "name" },
    { name: "Brand", key: "brand" },
    { name: "Unit Price", key: "unitPrice" },
    { name: "Shelf Life", key: "shelfLife" },
  ];
  const { filters, products, setFilters, filter, reload, query } =
    useProductTable();
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
          <Addproduct />
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
          result={products}
          DeleteItem={DeleteProduct}
          UpdateItem={UpdateProduct}
        />
      </div>
    </>
  );
};

export default ProductTable;
