import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import { filterInf } from "../_components/Filter";
import { IDBProduct } from "@/types/IProduct";
import toast, { Toaster } from "react-hot-toast";

export const useProductTable = () => {
  const [filters, setFilters] = useState<filterInf>({
    name: "",
  });
  let toastId = "";
  const [products, setProducts] = useState<IDBProduct[]>([]);
  const [productsData, setProductsData] = useState<IDBProduct[]>([]);

  const filter = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const nameFilter = (data: IDBProduct) => {
    return (
      filters.name.length === 0 ||
      (data.brand && data.brand.toLowerCase().includes(filters.name)) ||
      data.name.toLowerCase().includes(filters.name)
    );
  };

  const statusFilter = (data: IDBProduct) => {
    return (
      filters.status == null ||
      data.name.toLowerCase() === filters.status.toLowerCase()
    );
  };

  const query = useQuery("products", () => axios.get("/products"), {
    onSuccess(data) {
      setProducts(data.data.result);
      setProductsData(data.data.result);
    },
    onError(err) {
      console.log(err, "EEEEEEEEEEEEEEEEEE ");
    },
  });

  const reload = async () => {
    query.refetch();
  };

  useEffect(() => {
    setProducts(() => {
      return productsData.filter(
        (data) => nameFilter(data) && statusFilter(data)
      );
    });
  }, [filters, productsData]);

  return {
    filters,
    products,
    setFilters,
    filter,
    reload,
    query,
  };
};
