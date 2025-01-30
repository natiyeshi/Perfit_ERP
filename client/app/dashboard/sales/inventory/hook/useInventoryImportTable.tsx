"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientInventoryImport, IDBPopulatedInventoryImport } from "@/types/IInventoryImport";
import toast, { Toaster } from "react-hot-toast";

export const useInventoryImportTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [imports, setImports] = useState<IDBClientInventoryImport[]>([]);
  const [importsData, setImportsData] = useState<IDBClientInventoryImport[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientInventoryImport) => {
    return (
      filters.name.length === 0 ||
      (data.productName &&
        data.productName.toLowerCase().includes(filters.name)) ||
      (data.supplierName &&
        data.supplierName.toLowerCase().includes(filters.name))
    );
  };

  const statusFilter = (data: IDBClientInventoryImport) => {
    return (
      filters.status == null ||
      data.modeOfShipment?.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery(
    "imports",
    () => axios.get("/imports?populate=true"),
    {
      onSuccess(data) {
        let k: IDBPopulatedInventoryImport[] = data.data.result || [];
        const res: IDBClientInventoryImport[] = [];
        k.map((d) => {
          let r: IDBClientInventoryImport = {
            ...d,
            productName: d.product.name,
            supplierName: d.supplier.manufacturerName,
            unit: d.product.unit,
            // shelfLife: d.product.shelfLife,
            totalPrice: d.unitPrice * d.quantity,
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
    inventoryImports : imports,
    setFilters,
    filter,
    reload,
    query,
  };
};
