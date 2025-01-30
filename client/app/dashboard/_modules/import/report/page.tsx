"use client";
import TopImported from "./_components/TopImportedProducts/TopImported";
import LeastImportedProduct from "./_components/LeastImportedProduct";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { IDBClientImport, IDBPopulatedImport } from "@/types/IImport";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import TopSuppliers from "./_components/TopSuppliers";
import TopCompetitor from "./_components/TopCompetitor";

const page = () => {
  const [importsData, setImportsData] = useState<IDBPopulatedImport[]>([]);
  const query = useQuery(
    "competitor-imports",
    () => axios.get("/competitor-imports?populate=true"),
    {
      onSuccess(data) {
        let k: IDBPopulatedImport[] = data.data.result || [];
        setImportsData(k);
      },
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something goes wrong!!");
      },
    }
  );
  return (
    <>
      {query.isLoading ? (
        <div className="p-4">Loading...</div>
      ) : (
        <>
        {/* {JSON.stringify(importsData)} */}
        <div className="px-2 flex-1 pt-6 overflow-auto grid grid-cols-2 gap-5 gap-y-[10rem]">
          <LeastImportedProduct importsData={importsData} query={query} />
          <TopImported importsData={importsData} query={query} />
          <TopSuppliers importsData={importsData} query={query} />
          <TopCompetitor importsData={importsData} query={query} />
        </div>
        </>
      )}
    </>
  );
};

export default page;
