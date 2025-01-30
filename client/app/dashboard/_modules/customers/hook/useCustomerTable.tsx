import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBCustomer } from "@/types/ICustomer";
import toast, { Toaster } from "react-hot-toast";

export const useCustomerTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [customers, setCustomers] = useState<IDBCustomer[]>([]);
  const [customersData, setCustomersData] = useState<IDBCustomer[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBCustomer) => {
    return (
      filters.name.length === 0 ||
      data.organizationName.toLowerCase().includes(filters.name)
    );
  };

  const statusFilter = (data: IDBCustomer) => {
    return (
      filters.status == null ||
      data.organizationName.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery("customers", () => axios.get("/customers"), {
    onSuccess(data) {
      setCustomers(data.data.result);
      setCustomersData(data.data.result);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
    },
  });

  const reload = async () => {
    query.refetch();
  };

  useEffect(() => {
    setCustomers(() => {
      return customersData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, customersData]);

  return {
    filters,
    customers,
    setFilters,
    filter,
    reload,
    query,
  };
};
