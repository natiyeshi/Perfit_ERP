import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBSupplier } from "@/types/ISupplier";
import toast, { Toaster } from "react-hot-toast";

export const useSupplierTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [suppliers, setSuppliers] = useState<IDBSupplier[]>([]);
  const [suppliersData, setSuppliersData] = useState<IDBSupplier[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBSupplier) => {
    return (
      filters.name.length === 0 ||
      (data.name && data.name.toLowerCase().includes(filters.name)) ||
      (data.email && data.email.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBSupplier) => {
    return (
      filters.status == null
      //  ||
      // data.name?.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery("suppliers", () => axios.get("/suppliers"), {
    onSuccess(data) {
      setSuppliers(data.data.result);
      setSuppliersData(data.data.result);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
    },
  });

  const reload = async () => {
    query.refetch();
  };

  useEffect(() => {
    setSuppliers(() => {
      return suppliersData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, suppliersData]);

  return {
    filters,
    suppliers,
    setFilters,
    filter,
    reload,
    query,
  };
};
