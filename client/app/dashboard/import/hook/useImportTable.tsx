"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientImport, IDBPopulatedImport } from "@/types/IImport";
import toast, { Toaster } from "react-hot-toast";

export const useImportTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [imports, setImports] = useState<IDBClientImport[]>([]);
  const [importsData, setImportsData] = useState<IDBClientImport[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientImport) => {
    return (
      filters.name.length === 0 ||
      (data.productName &&
        data.productName.toLowerCase().includes(filters.name)) ||
      (data.competitorName &&
        data.competitorName.toLowerCase().includes(filters.name)) ||
      (data.supplierName &&
        data.supplierName.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBClientImport) => {
    return (
      filters.status == null ||
      data.modeOfShipment?.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery(
    "competitor-imports",
    () => axios.get("/competitor-imports?populate=true"),
    {
      onSuccess(data) {
        let k: IDBPopulatedImport[] = data.data.result || [];
        const res: IDBClientImport[] = [];
        k.map((d) => {
          let r: IDBClientImport = {
            ...d,
            productName: d.product.name,
            supplierName: d.supplier.name,
            competitorName: d.competitor.name,
          };
          res.push(r);
        });
        setImports(res);
        setImportsData(res);
      },
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
        toast.error("Something goes wrong!!");
      },
    }
  );

  const reload = async () => {
    query.refetch();
  };

  useEffect(() => {
    setImports(() => {
      return importsData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, importsData]);

  return {
    filters,
    imports,
    setFilters,
    filter,
    reload,
    query,
  };
};
