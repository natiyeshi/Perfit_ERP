import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import {
  IDBClientSupplier,
  IDBPopulatedSupplier,
  IDBSupplier,
} from "@/types/ISupplier";
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
      (data.manufacturerName &&
        data.manufacturerName.toLowerCase().includes(filters.name)) ||
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

  const query = useQuery(
    "suppliers?populate=true",
    () => axios.get("/suppliers"),
    {
      onSuccess(data) {
        let k: IDBPopulatedSupplier[] = data.data.result || [];
        const res: IDBClientSupplier[] = [];
        k.map((d) => {
          let r: IDBClientSupplier = {
            ...d,
            productName: "Products",
            clientDeliverableProducts: d.deliverableProducts?.map(
              (a) => a.name
            ),
          };
          res.push(r);
        });
        setSuppliers(res);
        setSuppliersData(res);
      },
      onError(err) {
        console.log(err, "EEEEEEEEEEEEEEEEEE ");
      },
    }
  );

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
