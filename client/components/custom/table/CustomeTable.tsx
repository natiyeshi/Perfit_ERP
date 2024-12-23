"use client"
import { JSXElementConstructor, ReactNode } from "react";
import Loading from "../loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CgOptions } from "react-icons/cg";
import NothingFound from "@/components/custom/NothingFound";

interface Header<T> {
  name: string;
  key: keyof T;
}

interface CustomeTableProps<T extends { id: string }> {
  query: {
    data: any; isLoading: boolean; isRefetching: boolean; isSuccess: boolean 
};
  headers: Header<T>[];
  result: T[];
  DeleteItem: JSXElementConstructor<{ id: string }>;
  UpdateItem: JSXElementConstructor<{ initialValues: T }>;
}

const CustomeTable = <T extends { id: string }>({
  query,
  headers,
  result,
  DeleteItem,
  UpdateItem,
}: CustomeTableProps<T>) => {
  return (
    <>
      <table className="min-w-full border-b shadow-lg">
        <thead>
          <tr className="text-left bg-zinc-900 sticky top-0 z-20">
            <th className="px-4 py-2 whitespace-nowrap border-b sticky left-0 bg-zinc-900">
              -
            </th>
            <th className="px-4 py-2 whitespace-nowrap border-b sticky left-0 bg-zinc-900">
              No
            </th>
            {headers.map((value) => (
              <th
                key={String(value.key)}
                className="px-4 py-2 whitespace-nowrap border-b"
              >
                {value.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {query.isLoading ? (
            <></>
          ) : query.data ? (
            result.map((item, index) => (
              <tr
                key={index}
                className="group hover:bg-zinc-800/20 duration-200"
              >
                <td className="border-b group-hover:bg-zinc-800/20 whitespace-nowrap duration-200 sticky left-0 bg-background">
                  <Popover>
                    <PopoverTrigger className="px-4 py-2 hover:bg-zinc-800">
                      <CgOptions className="text-lg" />
                    </PopoverTrigger>
                    <PopoverContent className="shadow">
                      <div>Options</div>
                      <div className="flex flex-col gap-1">
                        <DeleteItem id={String(item.id!) ?? "-"} />
                        <UpdateItem initialValues={item} />
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="border-b whitespace-nowrap px-4 py-2">
                  {index + 1}
                </td>
                {headers.map((header) => (
                  <td
                    className="border-b whitespace-nowrap duration-200 px-4 py-2"
                    key={String(header.key)}
                  >
                    {String(item[header.key]) ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
      {query.isLoading ? (
        <div className="flex flex-col gap-5 items-center justify-center  m-auto mt-12  px-6">
          <Loading className="m-auto" />
        </div>
      ) : (
        !query.isRefetching &&
        result.length === 0 && (
          <div className="flex flex-col gap-5 items-center justify-center  m-auto mt-12  px-6">
            <NothingFound />
            <div className="text-sm">Nothing Found</div>
          </div>
        )
      )}
      {}
    </>
  );
};

export default CustomeTable;
