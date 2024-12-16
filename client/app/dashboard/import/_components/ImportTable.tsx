"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoMdRefresh } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import FilterCard, { filterInf } from "./Filter";
import importDataDummy from "@/data/importDummyData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CgOptions } from "react-icons/cg";
interface ImportData {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  order_date: string;
  shelf_life: string;
  mode_of_shipment: string;
  product_name: string;
  product_brand: string;
  created_at: string;
  company_name: string;
}

const ImportTable: React.FC = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
    status: null,
    age: null,
    gender: null,
  });
  const [importData, setImportData] = useState<ImportData[]>(importDataDummy);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: ImportData) => {
    return (
      filters.name.length === 0 ||
      data.product_name.toLowerCase().includes(filters.name) ||
      data.product_brand.toLowerCase().includes(filters.name) ||
      data.company_name.toLowerCase().includes(filters.name)
    );
  };

  const reload = () => {
    setImportData(importDataDummy); // Reload dummy data
  };

  useEffect(() => {
    const applyFilters = () => {
      setImportData(() => {
        return importDataDummy.filter((data) => {
          return nameFilter(data);
        });
      });
    };
    applyFilters();
  }, [filters]);

  return (
    <>
      <div className="w-full py-2 px-2 flex justify-between">
        <div className="w-52">
          <Input
            placeholder="Search"
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
            variant="outline"
            className="px-2 rounded-full"
          >
            <IoMdRefresh className="text-xl" />
          </Button>
          <FilterCard setFilters={setFilters} filter={filters} />
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
        <table className="min-w-full border shadow-lg">
          <thead>
            <tr className="text-left bg-zinc-900 sticky top-0 z-20">
              <th className="px-4 py-2 whitespace-nowrap border" ></th>
              <th className="px-4 py-2 whitespace-nowrap border" >ID</th>
              <th className="px-4 py-2 whitespace-nowrap border">
                Product Name
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">
                Product Brand
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">Quantity</th>
              <th className="px-4 py-2 whitespace-nowrap border">Unit</th>
              <th className="px-4 py-2 whitespace-nowrap border">Unit Price</th>
              <th className="px-4 py-2 whitespace-nowrap border">
                Total Price
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">Order Date</th>
              <th className="px-4 py-2 whitespace-nowrap border">Shelf Life</th>
              <th className="px-4 py-2 whitespace-nowrap border">
                Mode of Shipment
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">Company</th>
            </tr>
          </thead>
          <tbody>
            {importData.map((data, index) => (
              <tr
                key={index}
                className={`group hover:bg-zinc-800/20 duration-200`}
              >
                <td  className="border-b cursor-pointer group-hover:bg-zinc-800 whitespace-nowrap duration-200  sticky left-0 bg-background">
                  <Popover>
                    <PopoverTrigger className="px-4 py-2">
                      <CgOptions className="text-lg" />
                    </PopoverTrigger>
                    <PopoverContent className="shadow">
                      <div>Options</div>
                      <div className="flex flex-col gap-2 mt-2">
                        {/* <DetailEmployee employee={employee} />
                      <EditEmployee initialValues={employee} />
                      <DeleteEmployee /> */}
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.id}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.product_name}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.product_brand}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.quantity}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.unit}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  ${data.unit_price}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  ${data.total_price}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.order_date}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.shelf_life}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.mode_of_shipment}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {data.company_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {importData.length === 0 && (
          <div className="flex w-32 m-auto mt-12 bg-zinc-900 px-6">
            Nothing Found
          </div>
        )}
      </div>
    </>
  );
};

export default ImportTable;
