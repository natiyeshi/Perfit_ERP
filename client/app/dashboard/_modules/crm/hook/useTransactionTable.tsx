"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientImport, IDBPopulatedImport } from "@/types/IImport";
import toast, { Toaster } from "react-hot-toast";
import { IDBClientTransaction, IDBPopulatedTransaction } from "@/types/ITransaction";

export const useTransactionTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [imports, setImports] = useState<IDBClientTransaction[]>([]);
  const [importsData, setImportsData] = useState<IDBClientTransaction[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientTransaction) => {
    return (
      filters.name.length === 0 ||
      (data.productName &&
        data.productName.toLowerCase().includes(filters.name)) ||
      data.customerName
    );
  };

  const statusFilter = (data: IDBClientTransaction) => {
    return filters.status == null;
  };

  const query = useQuery(
    "transactions",
    () => axios.get("/transactions?populate=true"),
    {
      onSuccess(data) {
        let k: IDBPopulatedTransaction[] = data.data.result || [];
        const res: IDBClientTransaction[] = [];
        k.map((d) => {
          let r: IDBClientTransaction = {
            ...d,
            customerName: d.customer.organizationName,
            productName: d.product.name,
            unitPrice : d.unitPrice,
            quantity : d.quantity,
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
