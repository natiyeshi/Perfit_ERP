"use client"
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBImport } from "@/types/IImport";
import toast, { Toaster } from "react-hot-toast";

export const useImportTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [imports, setImports] = useState<IDBImport[]>([]);
  const [importsData, setImportsData] = useState<IDBImport[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBImport) => {
    return (
      filters.name.length === 0 ||
      (data.modeOfShipment && data.modeOfShipment.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBImport) => {
    return (
      filters.status == null ||
      data.modeOfShipment?.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery("competitor-imports", () => axios.get("/competitor-imports"), {
    onSuccess(data) {
      console.log("Workign.....")
      setImports(data.data.result || []);
      setImportsData(data.data.result || []);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
      toast.error("Something goes wrong!!")
    },
  });

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
