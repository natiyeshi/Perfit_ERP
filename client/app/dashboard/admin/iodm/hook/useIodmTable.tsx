"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientIIodm, IDBPopulatedIODM } from "@/types/IIodm";
import toast, { Toaster } from "react-hot-toast";

export const useIodmTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [imports, setImports] = useState<IDBClientIIodm[]>([]);
  const [importsData, setImportsData] = useState<IDBClientIIodm[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientIIodm) => {
    return (
      filters.name.length === 0 ||
      (data.productName &&
        data.productName.toLowerCase().includes(filters.name)) ||
      (data.supplierName &&
        data.supplierName.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBClientIIodm) => {
    return filters.status == null;
  };

  const query = useQuery("IODMs", () => axios.get("/IODMs?populate=true"), {
    onSuccess(data) {
      let k: IDBPopulatedIODM[] = data.data.result || [];
      const res: IDBClientIIodm[] = [];
      k.map((d) => {
        let r: IDBClientIIodm = {
          ...d,
          productName: d.product.name,
          supplierName: d.supplier.manufacturerName,
          totalPrice: 0,
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
