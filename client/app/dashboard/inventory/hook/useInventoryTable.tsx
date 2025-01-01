"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBClientInventory, IDBInventory, IDBPopulatedInventory } from "@/types/IInventory";
import toast, { Toaster } from "react-hot-toast";

export const useInventoryTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [inventorys, setInventorys] = useState<IDBClientInventory[]>([]);
  const [inventorysData, setInventorysData] = useState<IDBClientInventory[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBClientInventory) => {
    return (
      filters.name.length === 0 ||
      (data.productName &&
        data.productName.toLowerCase().includes(filters.name)) 
    );
  };

  const statusFilter = (data: IDBClientInventory) => {
    return (
      filters.status == null
      //  ||
      // data.modeOfShipment?.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery(
    "inventories",
    () => axios.get("/inventories?populate=true"),
    {
      onSuccess(data) {

        let k: IDBPopulatedInventory[] = data.data.result || [];
        const res: IDBClientInventory[] = [];
        k.map((d) => {
          let r: IDBClientInventory = {
            ...d,
            productName: d.product.name,
          };
          res.push(r);
        });
        console.log(k,"+++++++")
        setInventorys(res);
        setInventorysData(res);
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
    setInventorys(() => {
      return inventorysData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, inventorysData]);

  return {
    filters,
    inventorys,
    setFilters,
    filter,
    reload,
    query,
  };
};
