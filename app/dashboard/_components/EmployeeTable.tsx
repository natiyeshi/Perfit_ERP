"use client";
import { Input } from "@/components/ui/input";
import { EmailOtpType } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import FilterCard, { filterInf } from "./Filter";
import { IoCloseSharp } from "react-icons/io5";
import AddEmployee from "@/components/custom/AddEmployee";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CgOptions } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import EditEmployee from "@/components/custom/EditEmployee";
import { IDBEmployee } from "@/types/IEmployee";
import DeleteEmployee from "@/components/custom/DeleteEmployee";
import DetailEmployee from "@/components/custom/DetailEmployee";
import { IoMdRefresh } from "react-icons/io";
import { getEmployees } from "../hr/_actions/employee";
import { createClient } from "@/utils/supabase/client";

interface TableProps {
  mainData: IDBEmployee[];
}

const EmployeeTable: React.FC<TableProps> = ({ mainData }) => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
    gender: null,
    age: null,
    status: null,
  });
  const [employees, setEmployees] = useState(mainData);
  const filter = (name: string, value: any) => {
    setFilters((d) => ({ ...d, [name]: value }));
  };
  const nameFilter = (data: IDBEmployee) => {
    return (
      filters.name.length < 0 ||
      data.first_name.toLowerCase().includes(filters.name) ||
      data.grand_father_name.toLowerCase().includes(filters.name) ||
      data.last_name.toLowerCase().includes(filters.name)
    );
  };
  const genderFilter = (data: IDBEmployee) => {
    return (
      filters.gender == null ||
      data.gender.toLowerCase() == filters.gender.toLowerCase()
    );
  };
  const statusFilter = (data: IDBEmployee) => {
    return (
      filters.status == null ||
      data.status.toLowerCase() == filters.status.toLowerCase()
    );
  };

  const reload = async () => {
    const { data, error } = await getEmployees();
    setEmployees(data ? data : []);
  };

  useEffect(() => {
    const func = () => {
      setEmployees(() => {
        return mainData.filter((data) => {
          return genderFilter(data) && nameFilter(data) && statusFilter(data);
        });
      });
    };
    func();
  }, [filters, mainData]);

  return (
    <>
      <div className="w-full py-2 px-2 flex justify-between">
        <div className="w-52">
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
            variant="outline"
            className="px-2 rounded-full"
          >
            <IoMdRefresh className="text-xl" />
          </Button>
          <AddEmployee setEmployees={setEmployees} />
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
                  onClick={() => filter(key, key == "name" ? "" : null)}
                  className="text-lg hover:bg-gray-200/20 rounded-full cursor-pointer"
                />
              </div>
            )
        )}
      </div>
      <div className="overflow-scroll flex-1">
        <table className="min-w-full  border  shadow-lg">
          <thead>
            <tr className="  text-left bg-zinc-900 sticky top-0 z-20">
              <th
                colSpan={2}
                className="px-4 py-2 whitespace-nowrap border sticky left-0  bg-zinc-900"
              >
                No
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">First Name</th>
              <th className="px-4 py-2 whitespace-nowrap border">Last Name</th>
              <th className="px-4 py-2 whitespace-nowrap border">
                Grandfather Name
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">Email</th>
              <th className="px-4 py-2 whitespace-nowrap border">
                Phone Number
              </th>
              <th className="px-4 py-2 whitespace-nowrap border">Position</th>
              <th className="px-4 py-2 whitespace-nowrap border">Department</th>
              <th className="px-4 py-2 whitespace-nowrap border">Status</th>
              <th className="px-4 py-2 whitespace-nowrap border">Date Hired</th>
              <th className="px-4 py-2 whitespace-nowrap border">Birth Date</th>
              <th className="px-4 py-2 whitespace-nowrap border">Gender</th>
            </tr>
          </thead>

          <tbody className="">
            {employees.map((employee, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "" : ""} group  hover:bg-zinc-800/20 duration-200`}
              >
                <td className="border-b cursor-pointer group-hover:bg-zinc-800 whitespace-nowrap duration-200  sticky left-0 bg-background">
                  <Popover>
                    <PopoverTrigger className="px-4 py-2">
                      <CgOptions className="text-lg" />
                    </PopoverTrigger>
                    <PopoverContent className="shadow">
                      <div>Options</div>
                      <div className="flex flex-col gap-2 mt-2">
                        <DetailEmployee employee={employee} />
                        <EditEmployee initialValues={employee} />
                        <DeleteEmployee />
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.first_name}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.last_name}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.grand_father_name}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.email}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.phone_number}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.position}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.department}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.status}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.date_hired}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.birth_date}
                </td>
                <td className="border whitespace-nowrap duration-200 px-4 py-2">
                  {employee.gender}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length == 0 && (
          <div className="flex w-32 m-auto mt-12 bg-zinc-900 px-6">
            Nothing Found
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeTable;
